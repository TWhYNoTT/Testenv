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
    onDragEnd: (data: ScheduleData[], movedAppointmentData?: { appointmentId: string, newTime: string, newDate: string }) => void;
    onTimeSlotSelect?: (time: string) => void;
    onEdit?: (appointmentId: string) => void;
    onDelete?: () => void;
}

const ScheduleList: React.FC<ScheduleListProps> = React.memo(({
    scheduleData,
    dateRange,
    onDragEnd,
    onTimeSlotSelect,
    onEdit,
    onDelete
}) => {
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const times = useMemo(() => {
        const timeSlots = [];

        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const amPm = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour % 12 || 12;
                const displayMinute = minute.toString().padStart(2, '0');
                timeSlots.push(`${displayHour}:${displayMinute} ${amPm}`);
            }
        }

        const morningStart = 7 * 4;
        return [...timeSlots.slice(morningStart), ...timeSlots.slice(0, morningStart)];
    }, []);

    const handleTimeSlotClick = useCallback((time: string) => {
        setSelectedTime(time);
        onTimeSlotSelect?.(time);
    }, [onTimeSlotSelect]);

    const getTimeIndex = useCallback((time: string) => times.indexOf(time), [times]);
    const getDateIndex = useCallback((date: string) => dateRange.indexOf(date), [dateRange]);

    const calculateRowSpan = useCallback((duration: string) => {
        if (duration.includes('h') && duration.includes('min')) {
            const hoursMatch = duration.match(/(\d+)h/);
            const minutesMatch = duration.match(/(\d+)min/);

            const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
            const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

            return (hours * 60 + minutes) / 15;
        }

        return 4;
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
        ), [times, dateRange]);

    const positions = useMemo(() => layoutPlaceholders, [layoutPlaceholders]);

    const handleDragStart = useCallback(() => {
        setIsDragging(true);
    }, []);

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setIsDragging(false);

        if (over) {
            const draggedAppointmentId = active.id as string;
            const overItem = positions.find(item => item.id === over.id);

            if (overItem && overItem.time && overItem.date) {
                // Find the dragged appointment
                const draggedAppointment = scheduleData.find(item => item.id === draggedAppointmentId);

                if (draggedAppointment) {
                    // Check if the position actually changed
                    if (draggedAppointment.time !== overItem.time || draggedAppointment.date !== overItem.date) {
                        console.log('Appointment moved:', {
                            id: draggedAppointmentId,
                            from: { time: draggedAppointment.time, date: draggedAppointment.date },
                            to: { time: overItem.time, date: overItem.date }
                        });

                        // Create updated data
                        const updatedData = scheduleData.map(item => {
                            if (item.id === draggedAppointmentId) {
                                return { ...item, time: overItem.time, date: overItem.date };
                            }
                            return item;
                        });

                        // Pass the moved appointment data to parent
                        onDragEnd(updatedData, {
                            appointmentId: draggedAppointmentId,
                            newTime: overItem.time,
                            newDate: overItem.date
                        });
                        return;
                    }
                }
            }
        }

        // No change occurred
        onDragEnd(scheduleData);
    }, [scheduleData, positions, onDragEnd]);

    const isOverlapping = useCallback((card1: ScheduleData, card2: ScheduleData) => {
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
                            leftPosition={'0'}
                        />
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
                                onEdit={onEdit}
                                onDelete={onDelete}
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
    onEdit?: (appointmentId: string) => void;
    onDelete?: () => void;
}

const DroppableCard: React.FC<DroppableCardProps> = React.memo(({
    id, position, isPlaceholder, cardWidth, leftPosition, isDragging, onEdit, onDelete
}) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        disabled: isPlaceholder,
    });

    // Create modified listeners that exclude the menu area
    const dragListeners = isPlaceholder ? {} : {
        ...listeners,
        onPointerDown: (e: React.PointerEvent) => {
            // Don't start drag if clicking on menu or its children
            const target = e.target as HTMLElement;
            if (target.closest('.menu') || target.closest('[class*="menu"]') ||
                target.closest('[class*="dropdown"]')) {
                e.stopPropagation();
                return;
            }
            listeners?.onPointerDown?.(e as any);
        }
    };

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
                    appointmentId={position.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            );
        }
        return null;
    }, [position, currCardWidth, onEdit, onDelete]);

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
            {...dragListeners}
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