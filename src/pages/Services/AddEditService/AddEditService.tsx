import React, { useState } from "react";
import InputField from "../../../components/InputField/InputField";
import Toggle from "../../../components/Toggle/Toggle";
import Button from "../../../components/Button/Button";
import Checkbox from "../../../components/Checkbox/Checkbox";
import ProgressBar from "../../../components/ProgressBar/ProgressBar";
import Dropdown from "../../../components/Dropdown/Dropdown";


import styles from './AddEditService.module.css';
import SearchBar from "../../../components/SearchBar/SearchBar";

// type PricingOption = {
//     pricingOptionName: string;
//     duration: string;
//     price: number;
// };

// type AddEditServiceProps = {
//     serviceData: {
//         serviceName: string;
//         category: string;
//         branch: string;
//         selectedServiceType: 'Men only' | 'Women only' | 'Everyone';
//         homeServicesAvailable: boolean;
//         pricingOptions: PricingOption[];
//         assignedEmployees: { id: number; name: string; role: string }[];
//     };
//     setServiceData: React.Dispatch<React.SetStateAction<{
//         serviceName: string;
//         category: string;
//         branch: string;
//         selectedServiceType: 'Men only' | 'Women only' | 'Everyone';
//         homeServicesAvailable: boolean;
//         pricingOptions: PricingOption[];
//         assignedEmployees: { id: number; name: string; role: string }[];
//     }>>;
// };


interface AddEditProps {
    isOpen: boolean;
    onClose: () => void;

}


//{ serviceData, setServiceData }
const AddEditService: React.FC<AddEditProps> = ({ onClose, isOpen }) => {
    const [step, setStep] = useState(1);




    const nextStep = () => {
        if (step < 3)
            setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1)
            setStep(step - 1);
    };



    // const handleInputChange = (name: string, value: any, index?: number) => {
    //     if (name === 'homeServicesAvailable') {
    //         setServiceData((prevData) => ({ ...prevData, [name]: Boolean(value) }));
    //     } else if (name === 'pricingOptionName' || name === 'duration' || name === 'price') {
    //         setServiceData((prevData) => {
    //             const pricingOptions = [...prevData.pricingOptions];
    //             if (index !== undefined) {
    //                 pricingOptions[index] = { ...pricingOptions[index], [name]: value };
    //             }
    //             return { ...prevData, pricingOptions };
    //         });
    //     } else {
    //         setServiceData((prevData) => ({ ...prevData, [name]: value }));
    //     }
    // };

    // const handleAddPricingOption = () => {
    //     setServiceData((prevData) => ({
    //         ...prevData,
    //         pricingOptions: [...prevData.pricingOptions, { pricingOptionName: '', duration: '', price: 0 }],
    //     }));
    // };

    return (
        <div className={`${styles.modalBackground} ${isOpen ? styles.open : ''}`}>
            <div className={`${styles.modalContainer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.progressWrappar}>
                    <button onClick={onClose} className={styles.closeButton} >&times;</button>
                    <ProgressBar progress={(step / 3) * 100} label={`Step ${step} out of 3`} />
                    <h2 className={`${styles.header} headerText`}>

                        {step === 1 && "Service information"}
                        {step === 2 && "Pricing & duration"}
                        {step === 3 && "Assign employee"}

                    </h2>
                </div>
                <div className={styles.headerCloseInputsContainer}>
                    {step === 1 &&
                        <>
                            <div className={styles.uploadphoto}>
                                <img src="./assets/icons/uploadphoto.png" alt="upload" />
                                <span className={styles.desc}>Upload service photo</span>
                            </div>
                            <InputField
                                label="Service name"
                                name="serviceName"
                                // value={serviceData.serviceName}
                                // onChange={(value) => handleInputChange('country', value)}
                                placeholder="Service name"
                            />
                            <Dropdown
                                label="Category"
                            // value={serviceData.category}
                            // onChange={(value) => handleInputChange('category', Array.isArray(value) ? value.join() : value)}

                            />
                            <Dropdown
                                label="Branch"
                            // value={serviceData.branch}
                            // onChange={(value) => handleInputChange('branch', Array.isArray(value) ? value.join() : value)}

                            />
                            <div className={styles.checkboxGroup}>
                                <Checkbox
                                    label="Men only"
                                    // checked={serviceData.selectedServiceType === 'Men only'}
                                    // onChange={() => handleInputChange('selectedServiceType', 'Men only')}
                                    checked={true}
                                    variant="button"
                                />
                                <Checkbox
                                    label="Women only"
                                    // checked={serviceData.selectedServiceType === 'Women only'}
                                    // onChange={() => handleInputChange('selectedServiceType', 'Women only')}

                                    variant="button"
                                />
                                <Checkbox
                                    label="Everyone"
                                    // checked={serviceData.selectedServiceType === 'Everyone'}
                                    // onChange={() => handleInputChange('selectedServiceType', 'Everyone')}
                                    variant="button"
                                />
                            </div>


                            <Toggle

                                name='homeServicesAvailable'
                                label="Home service available"
                            // checked={serviceData.homeServicesAvailable}
                            // onChange={(value) => handleInputChange('homeServicesAvailable', value ? 'true' : '')}
                            />
                        </>}
                    {step === 2 &&
                        <>



                            <InputField
                                label="Pricing option name"
                                name="pricingOptionName"

                                // onChange={(value) => handleInputChange('pricingOptionName', value)}
                                placeholder="Pricing option name"
                            />

                            <Dropdown
                                label="Duration"

                            // onChange={(value) => handleInputChange('duration', Array.isArray(value) ? value.join() : value)}

                            />

                            <InputField
                                label="Price"
                                name="price"

                                // onChange={(value) => handleInputChange('price', value)}
                                placeholder="Price"
                                type="number"
                                unit="AED"
                            />




                            <div className={styles.addBtn}>
                                <Button
                                    label="Add pricing option"
                                    noAppearance={true}
                                    backgroundColor="transparent"
                                    iconPosition="left"
                                    size="medium"
                                    fontColor="#6138e0"
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.0753 19L9.92529 1" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M1 10.075L19 9.92505" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>


                                    }
                                /></div>


                        </>
                    }
                    {step === 3 &&
                        <>



                            <div className={styles.searchSection}>
                                <SearchBar placeholder="Search employee" />
                            </div>
                            <div className={styles.empsContainer}>
                                <div className={styles.empCard}>
                                    <Checkbox />
                                    <img className={styles.empImg} src="./assets/icons/emp.png" alt="" />
                                    <div className={styles.empDetails}>
                                        <span className={styles.empName}>Ahmad Housam</span>
                                        <span className={styles.empTitle}>Junior stylist</span>
                                    </div>

                                </div>

                            </div>
                            <div className={styles.empsContainer}>
                                <div className={styles.empCard}>
                                    <Checkbox />
                                    <img className={styles.empImg} src="./assets/icons/emp1.png" alt="" />
                                    <div className={styles.empDetails}>
                                        <span className={styles.empName}>Adam Zanaty</span>
                                        <span className={styles.empTitle}>Salon manager</span>
                                    </div>

                                </div>

                            </div>
                            <div className={styles.empsContainer}>
                                <div className={styles.empCard}>
                                    <Checkbox />
                                    <img className={styles.empImg} src="./assets/icons/emp.png" alt="" />
                                    <div className={styles.empDetails}>
                                        <span className={styles.empName}>Ahmad Housam</span>
                                        <span className={styles.empTitle}>Junior stylist</span>
                                    </div>

                                </div>

                            </div>
                            <div className={styles.empsContainer}>
                                <div className={styles.empCard}>
                                    <Checkbox />
                                    <img className={styles.empImg} src="./assets/icons/emp1.png" alt="" />
                                    <div className={styles.empDetails}>
                                        <span className={styles.empName}>Adam Zanaty</span>
                                        <span className={styles.empTitle}>Salon manager</span>
                                    </div>

                                </div>

                            </div>



                        </>
                    }


                    <div className={styles.buttonContainer}>

                        <Button onClick={prevStep} label='Back' size='medium' noAppearance={true} disabled={step === 1} variant={step === 1 ? 'disabled' : 'primary'} />
                        <Button onClick={nextStep} label={step === 3 ? 'Done' : 'Next'} size='medium' />

                    </div>
                </div>
            </div>
        </div >
    );
};

export default AddEditService;

