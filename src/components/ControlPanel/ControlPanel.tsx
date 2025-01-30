import React, { ReactNode } from 'react';
import styles from './ControlPanel.module.css';

interface ControlItem {
    label: string;
    control: ReactNode;
}

interface ControlPanelProps {
    controls: ControlItem[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({ controls }) => {
    return (
        <div className={styles.controls}>
            {controls.map((item, index) => (
                <div key={index} className={styles.controllerContainer}>
                    {item.label}
                    {item.control}
                </div>
            ))}
        </div>
    );
};

export default ControlPanel;