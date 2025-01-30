import React from 'react';
import Toggle from '../../Toggle/Toggle';
import Checkbox from '../../Checkbox/Checkbox';
import Dropdown from '../../Dropdown/Dropdown';
import styles from './Step3.module.css';

type Step3Props = {
    alwaysOpen: boolean;
    setAlwaysOpen: React.Dispatch<React.SetStateAction<boolean>>;
    weekDays: string[];
    setWeekDays: React.Dispatch<React.SetStateAction<string[]>>;
    businessHours: { [key: string]: { from: string, to: string } };
    setBusinessHours: React.Dispatch<React.SetStateAction<{ [key: string]: { from: string, to: string } }>>;
};

const Step3: React.FC<Step3Props> = ({ alwaysOpen, setAlwaysOpen, weekDays, setWeekDays, businessHours, setBusinessHours }) => {
    const toggleAlwaysOpen = () => {
        setAlwaysOpen(!alwaysOpen);
    };

    const handleWeekDayChange = (day: string) => {
        setWeekDays(prevState => {
            if (prevState.includes(day)) {
                const newState = prevState.filter(d => d !== day);
                const { [day]: removed, ...rest } = businessHours;
                setBusinessHours(rest);
                return newState;
            } else {
                return [...prevState, day];
            }
        });
    };

    const handleBusinessHourChange = (day: string, time: 'from' | 'to', value: string | string[]) => {
        setBusinessHours(prevState => ({
            ...prevState,
            [day]: {
                ...prevState[day],
                [time]: value,
            },
        }));
    };

    const weekDaysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayHoursList = [
        '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
    ];

    return (
        <div className={styles.step3Container}>
            <h2 className='headerText'>Business hours</h2>

            <Toggle
                label="Always open"
                checked={alwaysOpen}
                onChange={toggleAlwaysOpen}
            />
            {!alwaysOpen && (
                <div className={styles.weekDaysContainer}>
                    {weekDaysList.map(day => (
                        <div key={day} className={styles.weekDayRow}>
                            <Checkbox
                                label={day}
                                checked={weekDays.includes(day)}
                                onChange={() => handleWeekDayChange(day)}
                            />

                            <div className={styles.dropdownContainer}>
                                <div className={styles.dropdown}>
                                    <Dropdown
                                        options={dayHoursList}
                                        value={businessHours[day]?.from || ''}
                                        onChange={(value) => handleBusinessHourChange(day, 'from', value)}
                                        variant={weekDays.includes(day) ? 'primary' : 'secondary'}
                                        disabled={!(weekDays.includes(day))}
                                        defaultMessage='24 hours'
                                    />
                                </div>
                                <div className={styles.dropdown}>
                                    <Dropdown
                                        options={dayHoursList}
                                        value={businessHours[day]?.to || ''}
                                        onChange={(value) => handleBusinessHourChange(day, 'to', value)}
                                        variant={weekDays.includes(day) ? 'primary' : 'secondary'}
                                        disabled={!(weekDays.includes(day))}
                                        defaultMessage='24 hours'
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Step3;
