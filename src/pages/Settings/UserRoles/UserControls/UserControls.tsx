import React, { useState } from 'react';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Calendar from '../../../../components/Calendar/Calendar';
import ControlPanel from '../../../../components/ControlPanel/ControlPanel';


const UserControls: React.FC = () => {
    const [branch, setBranch] = useState('All');
    const [date, setDate] = useState<Date | null>(null);

    const handleBranchChange = (value: string | string[]) => {
        if (typeof value === 'string') {
            setBranch(value);
        } else if (Array.isArray(value) && value.length > 0) {
            setBranch(value[0]);
        }
    };

    const handleDateChange = (date: Date) => setDate(date);

    const controls = [
        {
            label: 'Branch',
            control: (
                <Dropdown
                    options={['All', 'Branch 1', 'Branch 2', 'Branch 3']}
                    value={branch}
                    onChange={handleBranchChange}
                />
            ),
        },
        {
            label: 'Date joined',
            control: (
                <Calendar
                    selectedDate={date!}
                    value={date ? 'dateselected' : 'alltime'}
                    onDateChange={handleDateChange}
                />
            ),
        },
    ];

    return <ControlPanel controls={controls} />;
};

export default UserControls;