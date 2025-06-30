import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export const Gender = ({ onGenderChange }: { onGenderChange: (gender: string) => void }) => {
    const [selectedGender, setSelectedGender] = useState("");
    const [error, setError] = useState(true);

    const handleGenderChange = (gender: string) => {
        setSelectedGender(gender);
        setError(false);
        onGenderChange(gender);
    };

    return (
        <div className='flex items-center '>
            <div>
                <label className="block mb-2 text-sm font-semibold text-gray-900 pt-4">Gender</label>
            </div>
            <div className='flex pt-2 ml-4 '>
                <div className='flex items-center text-sm font-light'>
                    <label>Male</label>
                    <Checkbox
                        checked={selectedGender === "male"}
                        onChange={() => handleGenderChange("male")}
                        {...label}
                    />
                </div>
                <div className='flex items-center text-sm font-light'>
                    <label>Female</label>
                    <Checkbox
                        checked={selectedGender === "female"}
                        onChange={() => handleGenderChange("female")}
                        {...label}
                    />
                </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">Please select a gender.</p>}

        </div>
    );
};