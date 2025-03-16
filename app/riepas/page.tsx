"use client";

import { useState, useEffect, useRef } from "react";
import { Job, columns } from "../columns";
import { DataTable } from "../data-table";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import { TasksCard } from "@/components/TasksCard";
import { ColumnVisibilityToggle } from "@/components/ColumnVisibilityToggle";
import { useReactTable, getCoreRowModel, VisibilityState } from "@tanstack/react-table";
import { Diena } from "@/components/Diena";
import { AppPieChart } from "@/components/AppPieChart";
import { SkeletonTable } from "@/components/skeletons/SkeletonTable";
import { TasksSkeleton } from "@/components/skeletons/TasksSkeleton";
import { PieChartSkeleton } from "@/components/skeletons/PieChartSkeleton";
import { fetchJobs } from "@/app/actions";
import { ArrowDownToLine } from "lucide-react";

interface SanitizedJob {
  queue_id: number;
  iorder: number;
  takenby: {
    car_brand: string;
    car_model: string;
    service: number;
    lic_plate: string;
  };
}

export default function Home() {
  const [allData, setAllData] = useState<SanitizedJob[]>([]);
  const [filteredData, setFilteredData] = useState<Job[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [queueRange, setQueueRange] = useState<[number, number]>([1, 3]);
  const [totals, setTotals] = useState({
    all: 0,
    cars: 0,
    ac: 0,
    bikes: 0,
    filtered: {
      all: 0,
      cars: 0,
      ac: 0,
      bikes: 0
    }
  });
  const [selectedDate, setSelectedDate] = useState<string>(getLocalDate());
  const [loading, setLoading] = useState<boolean>(true);
  const [remainingRowsCount, setRemainingRowsCount] = useState<number>(0); // State for remaining rows count
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Ref for the current time row
  const currentTimeRowRef = useRef<HTMLTableRowElement>(null);

  const handleCardClick = (filterType: string | null) => {
    setActiveFilter(activeFilter === filterType ? null : filterType);
  };
  
  // Function to scroll to the current time row
  const scrollToCurrentTime = () => {
    if (currentTimeRowRef.current) {
      currentTimeRowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  function getLocalDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility },
  });

  // Fetch all data when date changes
  useEffect(() => {
    async function loadAllData() {
      setLoading(true);
      try {
        const jsonData = await fetchJobs(selectedDate);
        setAllData(jsonData);
      } catch (error) {
        console.error("Data loading error:", error);
        setAllData([]);
        setFilteredData([]);
        setTotals({ 
          all: 0, 
          cars: 0, 
          ac: 0, 
          bikes: 0, 
          filtered: { all: 0, cars: 0, ac: 0, bikes: 0 } 
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadAllData();
  }, [selectedDate]);

  // Process and filter data when queue range or allData changes
  useEffect(() => {
    if (allData.length === 0) {
      setFilteredData([]);
      setTotals({
        all: 0,
        cars: 0,
        ac: 0,
        bikes: 0,
        filtered: {
          all: 0,
          cars: 0,
          ac: 0,
          bikes: 0
        }
      });
      return;
    }
  
    let totalAll = 0, totalCars = 0, totalAC = 0, totalBikes = 0;
    let filteredAll = 0, filteredCars = 0, filteredAC = 0, filteredBikes = 0;
  
    const formatTime = (iorder: number) => {
      const baseHour = 9;
      const minutes = iorder * 15;
      const hours = baseHour + Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}:${mins.toString().padStart(2, "0")}`;
    };
  
    const groupedData: Record<number, { 
      time: string;
      cars: string[];
      brands: string[];
      types: number[];
      lic_plates: string[];
    }> = {};
  
    allData
    .filter(item => 
      item.queue_id >= queueRange[0] && 
      item.queue_id <= queueRange[1] &&
      item.takenby.service > 0
    )
    .forEach(item => {
      const { takenby } = item;
      
      // Count all items for unfiltered totals
      totalAll++;
      if ([1, 2, 3].includes(takenby.service)) totalCars++;
      if (takenby.service === 6) totalAC++;
      if ([8, 9].includes(takenby.service)) totalBikes++;

      // Check if item passes current filter
      const passesFilter = !activeFilter || 
        (activeFilter === 'cars' && [1, 2, 3].includes(takenby.service)) ||
        (activeFilter === 'bikes' && [8, 9].includes(takenby.service)) ||
        (activeFilter === 'ac' && takenby.service === 6);

      if (passesFilter) {
        const time = formatTime(item.iorder);
        
        if (!groupedData[item.iorder]) {
          groupedData[item.iorder] = { 
            time, 
            cars: [], 
            brands: [], 
            types: [], 
            lic_plates: [] 
          };
        }

        groupedData[item.iorder].cars.push(takenby.car_model);
        groupedData[item.iorder].brands.push(takenby.car_brand);
        groupedData[item.iorder].types.push(takenby.service);
        groupedData[item.iorder].lic_plates.push(takenby.lic_plate);

        filteredAll++;
        if ([1, 2, 3].includes(takenby.service)) filteredCars++;
        if (takenby.service === 6) filteredAC++;
        if ([8, 9].includes(takenby.service)) filteredBikes++;
      }
    });

    const formattedData: Job[] = Object.entries(groupedData).flatMap(
      ([, { time, cars, brands, types, lic_plates }]) => 
        cars.map((car, index) => ({
          time: index === 0 ? time : "",
          car,
          brand: brands[index],
          type: types[index],
          lic_plate: lic_plates[index],
          rowSpan: index === 0 ? cars.length : 0,
        }))
    );

    setFilteredData(formattedData);
    setTotals({
      all: totalAll,
      cars: totalCars,
      ac: totalAC,
      bikes: totalBikes,
      filtered: {
        all: filteredAll,
        cars: filteredCars,
        ac: filteredAC,
        bikes: filteredBikes
      }
    });
}, [allData, queueRange, activeFilter]);

  return (
    <div className="container mx-auto my-4">
      {loading ? (
        <div className="flex flex-row justify-between gap-4 my-2 text-center">
          <TasksSkeleton />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <ModeToggle />
            <h2 className="text-xl font-bold mx-4">
              {queueRange[0] === 1 ? "Ulbroka" : "Kalnciems"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQueueRange(queueRange[0] === 1 ? [4, 5] : [1, 3])}
            >
              Mainīt servisu
            </Button>
          </div>

          <div className="flex flex-4 flex-row justify-between gap-4 my-2 text-center">
            <TasksCard 
              title="Kopā" 
              value={totals.all} 
              variant="indigo-500" 
              onClick={() => handleCardClick(null)}
              isActive={activeFilter === null}
            />
            <TasksCard 
              title="Mašīnas" 
              value={totals.cars} 
              variant="blue-500" 
              onClick={() => handleCardClick('cars')}
              isActive={activeFilter === 'cars'}
            />
            <TasksCard 
              title="Moči" 
              value={totals.bikes} 
              variant="green-500" 
              onClick={() => handleCardClick('bikes')}
              isActive={activeFilter === 'bikes'}
            />
            <TasksCard 
              title="Kondiškas" 
              value={totals.ac} 
              variant="red-500" 
              onClick={() => handleCardClick('ac')}
              isActive={activeFilter === 'ac'}
            />
          </div>

          <div className="flex justify-between my-2">
            <Diena 
              onDateChange={setSelectedDate} 
              value={selectedDate}
            />
            <ColumnVisibilityToggle table={table} />
            {/* Button to scroll to current time row */}
            <Button onClick={scrollToCurrentTime} disabled={remainingRowsCount === 0} variant="outline">
              <ArrowDownToLine />
            </Button>
          </div>

          {/* Display remaining rows count */}
          {/* <div className="my-2 text-sm text-gray-600">
            {remainingRowsCount === 0 ? 'Vairs nav mašīnu' : <p>Vēl palikušas {remainingRowsCount} mašīnas</p>}
          </div> */}
        </>
      )}

      {loading ? (
        <div className="flex flex-4 flex-row justify-between gap-4 my-2 text-center">
          <SkeletonTable />
        </div>
      ) : (
        <DataTable 
          table={table} 
          currentTimeRowRef={currentTimeRowRef} // Pass the ref to DataTable
          onRemainingRowsCountChange={setRemainingRowsCount} // Pass the callback
        />
      )}

      {loading ? (
        <div className="flex justify-center mt-6">
          <PieChartSkeleton />
        </div>
      ) : (
        <div className="py-5">
          <AppPieChart
            data={[
              { name: "Mašīnas", value: totals.cars, fill: "hsl(var(--chart-2))" },
              { name: "Moči", value: totals.bikes, fill: "hsl(var(--chart-3))" },
              { name: "Kondiškas", value: totals.ac, fill: "hsl(var(--chart-4))" },
            ]}
          />
        </div>
      )}
    </div>
  );
}