import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import TimeSlots from './TimeSlot';
import ScheduleCard from './ScheduleCard';
import styles from './ScheduleList.module.css';

interface ScheduleData {
    id: string;
    service: string;
    customer: string;
    contact: string;
    duration: string;
    price: string;
    status: string;
    image: string;
    time: string;
    date: string;
}

interface Placeholder {
    id: string;
    columnIndex: number;
    startIndex: number;
    rowSpan: number;
    time: string;
    date: string;
}

interface ScheduleListProps {
    scheduleData: ScheduleData[];
    dateRange: string[];
    onDragEnd: (data: ScheduleData[]) => void;
    onTimeSlotSelect?: (time: string) => void; // Add this prop
}

const ScheduleList: React.FC<ScheduleListProps> = React.memo(({
    scheduleData,
    dateRange,
    onDragEnd,
    onTimeSlotSelect  // Add this prop
}) => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const times = useMemo(() => {
        const timeSlots = [];

        // Generate all 24 hours with 15-minute intervals
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const amPm = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12 AM
                const displayMinute = minute.toString().padStart(2, '0');
                timeSlots.push(`${displayHour}:${displayMinute} ${amPm}`);
            }
        }

        // Start the day at 7 AM (reorder array)
        const morningStart = 7 * 4; // 7 AM (4 slots per hour)
        return [...timeSlots.slice(morningStart), ...timeSlots.slice(0, morningStart)];
    }, []);
    const handleTimeSlotClick = useCallback((time: string) => {
        setSelectedTime(time);
        onTimeSlotSelect?.(time); // Call the prop if provided
    }, [onTimeSlotSelect]);

    const getTimeIndex = useCallback((time: string) => times.indexOf(time), [times]);
    const getDateIndex = useCallback((date: string) => dateRange.indexOf(date), [dateRange]);

    const calculateRowSpan = useCallback((duration: string) => {
        // Check if format is "Xh Ymin"
        if (duration.includes('h') && duration.includes('min')) {
            const hoursMatch = duration.match(/(\d+)h/);
            const minutesMatch = duration.match(/(\d+)min/);

            const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
            const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

            return (hours * 60 + minutes) / 15;
        }

        // Fallback for other formats
        return 4; // Default to 1 hour
    }, []);

    const layoutPlaceholders = useMemo(() =>
        times.flatMap((time, index) =>
            dateRange.map((date, dateIndex) => ({
                id: `placeholder-${dateIndex}-${time}-${date}`,
                columnIndex: dateIndex,
                startIndex: index,
                rowSpan: 1,
                time,
                date
            }))
        )
        , [times, dateRange]);

    const positions = useMemo(() => layoutPlaceholders, [layoutPlaceholders]);

    const handleDragStart = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setIsDragging(false);

        if (over) {
            const oldIndex = scheduleData.findIndex(item => item.id === active.id);
            const overItem = positions.find(item => item.id === over.id);

            if (oldIndex !== -1 && overItem && overItem.time) {
                const updatedData = [...scheduleData];
                const movedItem = { ...updatedData[oldIndex], time: overItem.time, date: overItem.date };

                updatedData.splice(oldIndex, 1);

                const overIndex = updatedData.findIndex(item => item.id === over.id);
                if (overIndex !== -1) {
                    updatedData.splice(overIndex + 1, 0, movedItem);
                } else {
                    updatedData.push(movedItem);
                }

                onDragEnd(updatedData);
            }
        }
    }, [scheduleData, positions, onDragEnd]);

    const isOverlapping = useCallback((card1: ScheduleData, card2: ScheduleData) => {
        console.log(card1, card2, 'overlapping');
        const card1StartIndex = getTimeIndex(card1.time);
        const card1EndIndex = card1StartIndex + calculateRowSpan(card1.duration);

        const card2StartIndex = getTimeIndex(card2.time);
        const card2EndIndex = card2StartIndex + calculateRowSpan(card2.duration);

        return (
            card1EndIndex > card2StartIndex &&
            card2EndIndex > card1StartIndex
        );
    }, [getTimeIndex, calculateRowSpan]);

    const calculateOverlapGroups = useCallback((columnIndex: number, startIndex: number, rowSpan: number) => {
        const overlappingCards = scheduleData.filter((item) => {
            const itemStartIndex = getTimeIndex(item.time);
            const itemDateIndex = getDateIndex(item.date);
            const itemRowSpan = calculateRowSpan(item.duration);

            return (
                itemDateIndex === columnIndex &&
                itemStartIndex < startIndex + rowSpan &&
                startIndex < itemStartIndex + itemRowSpan
            );
        });

        const groups: ScheduleData[][] = [];
        overlappingCards.forEach((card) => {
            let added = false;
            for (const group of groups) {
                if (group.some((groupCard) => isOverlapping(groupCard, card))) {
                    group.push(card);
                    added = true;
                    break;
                }
            }
            if (!added) {
                groups.push([card]);
            }
        });

        return groups;
    }, [scheduleData, getTimeIndex, getDateIndex, calculateRowSpan, isOverlapping]);

    const calculateCardWidthAndPosition = useCallback((card: ScheduleData, columnIndex: number, startIndex: number, rowSpan: number) => {
        const groups = calculateOverlapGroups(columnIndex, startIndex, rowSpan);
        console.log(groups, startIndex, 'groups');
        for (const group of groups) {
            if (group.some((groupCard) => groupCard.id === card.id)) {
                const cardIndexInGroup = group.findIndex((c) => c.id === card.id);
                const cardWidth = 100 / group.length;
                const leftPosition = `${cardWidth * cardIndexInGroup}%`;

                return { cardWidth, leftPosition };
            }
        }

        return { cardWidth: 100, leftPosition: '0%' };
    }, [calculateOverlapGroups]);

    return (
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div id="tooltip" className={styles.tooltip}></div>

            <div className={styles.scheduleContainer}>
                <div className={styles.timeSlots}>
                    <TimeSlots times={times} onTimeSlotClick={handleTimeSlotClick} selectedTime={selectedTime} />
                </div>

                <div className={styles.scheduleGrid}>
                    {positions.map((position) => (
                        <DroppableCard
                            key={position.id}
                            id={position.id}
                            position={position}
                            isPlaceholder={true}
                            isDragging={isDragging}
                            cardWidth={0}
                            leftPosition={'0'} />
                    ))}

                    {scheduleData.map((data) => {
                        const startIndex = getTimeIndex(data.time);
                        const dateIndex = getDateIndex(data.date);
                        const rowSpan = calculateRowSpan(data.duration);
                        const { cardWidth, leftPosition } = calculateCardWidthAndPosition(
                            data,
                            dateIndex,
                            startIndex,
                            rowSpan
                        );

                        return (
                            <DroppableCard
                                key={data.id}
                                id={data.id}
                                position={{ ...data, columnIndex: dateIndex, startIndex, rowSpan, dateIndex }}
                                isPlaceholder={false}
                                cardWidth={cardWidth}
                                leftPosition={leftPosition}
                                isDragging={isDragging}
                            />
                        );
                    })}

                    {selectedTime && (
                        <div className={styles.horizontalLine} style={{ gridRow: `${getTimeIndex(selectedTime) + 1}` }}></div>
                    )}
                </div>
            </div>
        </DndContext>
    );
});

interface DroppableCardProps {
    id: string;
    position: Placeholder | (ScheduleData & { columnIndex: number; startIndex: number; rowSpan: number; dateIndex: number });
    isPlaceholder: boolean;
    isDragging: boolean;
    cardWidth: number;
    leftPosition: string;
}

const DroppableCard: React.FC<DroppableCardProps> = React.memo(({
    id, position, isPlaceholder, cardWidth, leftPosition, isDragging
}) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        disabled: isPlaceholder,
    });

    const { isOver: droppableIsOver, setNodeRef: setDroppableNodeRef } = useDroppable({
        id,
    });

    const [currCardWidth, setCurrCardWidth] = useState<number>(0);

    const style: React.CSSProperties = useMemo(() => ({
        transform: isPlaceholder ? undefined : CSS.Transform.toString({
            x: transform?.x ?? 0,
            y: transform?.y ?? 0,
            scaleX: 1,
            scaleY: 1,
        }),
        gridColumn: `${position.columnIndex + 1} / span 1`,
        gridRow: `${position.startIndex + 1} / span ${position.rowSpan}`,
        backgroundColor: isPlaceholder ? (droppableIsOver ? '#dedaeb86' : '') : '',
        width: isPlaceholder ? '100%' : `${cardWidth}%`,
        left: !isPlaceholder ? leftPosition : undefined,
        cursor: !isPlaceholder ? (isDragging ? 'grabbing' : 'grab') : '',
        zIndex: isPlaceholder && droppableIsOver ? 10 : 'auto',
        border: !isPlaceholder ? '2px solid transparent' : 'none',
        borderRight: isPlaceholder ? '1px solid #D8CCFE' : '2px solid transparent',
        borderTop: isPlaceholder
            ? (() => {
                const match = position.time.match(/^(\d{1,2}):(\d{2})/);
                if (match) {
                    return ((parseInt(match[1] + match[2])) % 100) === 0
                        ? '1px solid #D8CCFE'
                        : 'none';
                }
                return 'none';
            })()
            : '2px solid transparent',
    }), [isPlaceholder, droppableIsOver, transform, position, cardWidth, leftPosition, isDragging]);

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.textContent = `${position.time}`;
        }
    }, [position.time]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 10}px`;
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
        }
    }, []);

    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (divRef.current) {
            setCurrCardWidth(divRef.current.getBoundingClientRect().width);
        }
    }, [position.columnIndex, position.startIndex, position.rowSpan, leftPosition, cardWidth]);

    const renderScheduleCard = useCallback(() => {
        if ('service' in position) {
            return (
                <ScheduleCard
                    service={position.service}
                    customer={position.customer}
                    contact={position.contact}
                    duration={position.duration}
                    price={position.price}
                    status={position.status}
                    image={position.image}
                    isShrinked={currCardWidth < 260}
                />
            );
        }
        return null;
    }, [position, currCardWidth]);

    return (
        <div
            ref={(node) => {
                divRef.current = node;
                setNodeRef(node);
                if (isPlaceholder) {
                    setDroppableNodeRef(node);
                }
            }}
            style={style}
            {...attributes}
            {...listeners}
            className={`${styles.scheduleCardWrapper} ${isPlaceholder ? styles.isPlaceholder : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {isPlaceholder ? (droppableIsOver ? position.time : '') : renderScheduleCard()}
        </div>
    );
});

export default ScheduleList;