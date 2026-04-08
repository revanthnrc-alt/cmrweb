import React, { useState } from 'react';
import { format, subDays, getDay, getMonth } from 'date-fns';
import { cn } from '@/src/lib/cn';

export interface ActivityData {
  date: string;
  count: number;
}

export interface ActivityHeatmapProps {
  data: ActivityData[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  // Generate 365 days of data ending today if data is empty
  const heatmapData = data.length > 0 ? data : Array.from({ length: 365 }).map((_, i) => {
    const date = subDays(new Date(), 364 - i);
    const dayOfWeek = getDay(date);
    // Less activity on weekends
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const maxCount = isWeekend ? 3 : 10;
    const count = Math.random() > 0.4 ? Math.floor(Math.random() * maxCount) : 0;
    return {
      date: format(date, 'yyyy-MM-dd'),
      count,
    };
  });

  // Group into weeks (columns)
  const weeks: ActivityData[][] = [];
  let currentWeek: ActivityData[] = [];

  // Pad the first week to start on Sunday
  const firstDate = new Date(heatmapData[0].date);
  const firstDayOfWeek = getDay(firstDate);
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({ date: '', count: -1 }); // Empty padding
  }

  heatmapData.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: -1 });
    }
    weeks.push(currentWeek);
  }

  const getColor = (count: number) => {
    if (count === -1) return 'transparent';
    if (count === 0) return 'rgba(255,255,255,0.04)';
    if (count < 3) return 'rgba(0,217,255,0.2)';
    if (count < 6) return 'rgba(0,217,255,0.5)';
    return 'rgba(0,217,255,0.9)';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Calculate month label positions
  const monthLabels: { month: string; colIndex: number }[] = [];
  let currentMonth = -1;
  weeks.forEach((week, index) => {
    const firstValidDay = week.find(d => d.count !== -1);
    if (firstValidDay) {
      const month = getMonth(new Date(firstValidDay.date));
      if (month !== currentMonth) {
        monthLabels.push({ month: months[month], colIndex: index });
        currentMonth = month;
      }
    }
  });

  return (
    <div className="relative w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="min-w-max">
        {/* Month Labels */}
        <div className="flex mb-2 h-4 relative text-xs text-text-muted font-medium">
          {monthLabels.map((label, i) => (
            <span 
              key={i} 
              className="absolute" 
              style={{ left: `${label.colIndex * 14}px` }}
            >
              {label.month}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[2px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={cn(
                    "w-3 h-3 rounded-sm transition-colors duration-200",
                    day.count !== -1 && "hover:ring-1 ring-accent-cyan ring-offset-1 ring-offset-bg-card cursor-pointer"
                  )}
                  style={{ backgroundColor: getColor(day.count) }}
                  onMouseEnter={(e) => {
                    if (day.count !== -1) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCell({
                        date: day.date,
                        count: day.count,
                        x: rect.left + window.scrollX,
                        y: rect.top + window.scrollY,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <div 
          className="fixed z-50 pointer-events-none bg-bg-surface border border-border-subtle px-3 py-2 rounded-md shadow-xl text-sm font-medium text-text-primary backdrop-blur-md transform -translate-x-1/2 -translate-y-full mt-[-8px]"
          style={{ left: hoveredCell.x + 6, top: hoveredCell.y }}
        >
          <span className="text-accent-cyan">{hoveredCell.count}</span> contributions on {format(new Date(hoveredCell.date), 'MMM d, yyyy')}
        </div>
      )}
    </div>
  );
};
