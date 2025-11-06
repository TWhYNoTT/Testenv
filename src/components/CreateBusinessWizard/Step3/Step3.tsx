import React from 'react';
import Toggle from '../../../components/Toggle/Toggle';
import Checkbox from '../../../components/Checkbox/Checkbox';
import Dropdown from '../../../components/Dropdown/Dropdown';
import styles from './Step3.module.css';

interface BusinessHour {
    dayOfWeek: number;
    isOpen: boolean;
    openTime?: string;
    closeTime?: string;
    is24Hours: boolean;
}

interface Step3Props {
    alwaysOpen: boolean;
    setAlwaysOpen: (value: boolean) => void;
    businessHours: BusinessHour[];
    setBusinessHours: React.Dispatch<React.SetStateAction<BusinessHour[]>>;
    errors?: {
        businessHours?: string;
        invalidDays?: (string | undefined)[];
    };
}

const Step3: React.FC<Step3Props> = ({
    alwaysOpen,
    setAlwaysOpen,
    businessHours,
    setBusinessHours,
    errors
}) => {
    const toggleAlwaysOpen = () => {
        setAlwaysOpen(!alwaysOpen);
        if (!alwaysOpen) {
            // When turning ON always open
            setBusinessHours(businessHours.map(hour => ({
                ...hour,
                isOpen: true,
                is24Hours: true
            })));
        } else {
            // When turning OFF always open
            setBusinessHours(businessHours.map(hour => ({
                ...hour,
                isOpen: false,
                is24Hours: false,
                openTime: undefined,
                closeTime: undefined
            })));
        }
    };

    const handleDayToggle = (dayIndex: number) => {
        setBusinessHours(businessHours.map((hour, index) =>
            index === dayIndex
                ? { ...hour, isOpen: !hour.isOpen }
                : hour
        ));
    };

    const handleTimeChange = (dayIndex: number, timeType: 'openTime' | 'closeTime', value: string) => {
        setBusinessHours(businessHours.map((hour, index) =>
            index === dayIndex
                ? { ...hour, [timeType]: value }
                : hour
        ));
    };

    const dayHoursList = [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ];

    const weekDaysList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
                    {businessHours.map((hour, index) => (
                        <div key={weekDaysList[index]} className={styles.weekDayRow}>
                            <Checkbox
                                label={weekDaysList[index]}
                                checked={hour.isOpen}
                                onChange={() => handleDayToggle(index)}
                            />

                            <div className={styles.dropdownContainer}>
                                <div className={styles.dropdown}>
                                    <Dropdown
                                        options={dayHoursList}
                                        value={hour.openTime || ''}
                                        onChange={(value) => handleTimeChange(index, 'openTime', value.toString())}
                                        variant={hour.isOpen ? 'primary' : 'secondary'}
                                        disabled={!hour.isOpen || hour.is24Hours}
                                        defaultMessage='Opening time'
                                    />
                                </div>
                                <div className={styles.dropdown}>
                                    <Dropdown
                                        options={dayHoursList}
                                        value={hour.closeTime || ''}
                                        onChange={(value) => handleTimeChange(index, 'closeTime', value.toString())}
                                        variant={hour.isOpen ? 'primary' : 'secondary'}
                                        disabled={!hour.isOpen || hour.is24Hours}
                                        defaultMessage='Closing time'
                                    />
                                </div>
                                {errors?.invalidDays?.[index] && (
                                    <div className={styles.dayError}>{errors.invalidDays[index]}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {errors?.businessHours && (
                <div className={styles.error}>{errors.businessHours}</div>
            )}
        </div>
    );
};

export default Step3;