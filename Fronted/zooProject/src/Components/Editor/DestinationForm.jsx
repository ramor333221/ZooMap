import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../../Scss/DestinationForm.scss';
import { BASE_URL } from '../../Api/apiSlice';

const DestinationForm = ({
    formData,
    setFormData,
    categories,
    handleSubmit,
    loading,
    onCancel
}) => {

    const { register, handleSubmit: rhfSubmit, setValue } = useForm({
        defaultValues: {
            name: formData.name || '',
            category: formData.category || '',
            description: formData.description || ''
        }
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        setValue('name', formData.name || '');
        setValue('category', formData.category || '');
        setValue('description', formData.description || '');
    }, [formData, setValue]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        setFormData({
            ...formData,
            imageFile: file,
            previewUrl: url
        });
    };

    const getImageSource = () => {
        if (previewUrl) return previewUrl;

        if (formData.picUrl) {
            if (formData.picUrl.startsWith('http')) return formData.picUrl;

            const serverHost = BASE_URL.replace('/api', '');
            const path = formData.picUrl.startsWith('/')
                ? formData.picUrl
                : `/${formData.picUrl}`;

            return `${serverHost}${path}`;
        }

        return null;
    };

    const imageSrc = getImageSource();

    return (
        <div className="inline-map-controls-form">

            <form
                className="controls-form-row"
                onSubmit={rhfSubmit((data) => {
                    handleSubmit({
                        ...formData,
                        ...data
                    });
                })}
            >
                <div className="form-info-segment">
                    <span className="form-title">
                        {formData.id ? '✏️ Edit Landmark' : '📍 New Landmark'}
                    </span>
                </div>

                <div className="form-inputs-segment">

                    <input
                        type="text"
                        placeholder="Point Name"
                        {...register('name', { required: true })}
                        className="form-input"
                    />

                    <select
                        {...register('category')}
                        className="form-select"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.replace('_', ' ')}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Description"
                        {...register('description')}
                        className="form-input"
                    />

                    <div className="file-upload-wrapper">
                        <label htmlFor="sidebar-file-input" className="form-input">
                            <span>📁</span>
                            <span>{imageSrc ? 'Change Image' : 'Upload Image'}</span>
                        </label>

                        <input
                            id="sidebar-file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />

                        {imageSrc && (
                            <img
                                src={imageSrc}
                                alt="Preview"
                                className="image-preview-thumb"
                            />
                        )}
                    </div>

                </div>

                <div className="button-group-row">
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? '...' : 'Save'}
                    </button>

                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    );
};

export default DestinationForm;