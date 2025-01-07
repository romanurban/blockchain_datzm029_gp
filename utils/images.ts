export type PropertyType = 'apartment' | 'house' | 'office';

interface PropertyImageSet {
    folder: string;
    images: string[];
}

// Map of property image sets by folder
const propertyImageSets: Record<string, PropertyImageSet> = {
    'apartment001': {
        folder: 'apartment001',
        images: [
            '/images/apartment001/360_F_647793544_ZAjbiCZxRdPOWLcYRIHW8alUGxLT83p4.jpg',
            '/images/apartment001/christmas-cozy-new-york-apartment-interior-free-photo.webp',
            '/images/apartment001/image.jpg'
        ]
    },
    'apartment002': {
        folder: 'apartment002',
        images: [
            '/images/apartment002/images.jpeg',
            '/images/apartment002/images (1).jpeg',
            '/images/apartment002/images (2).jpeg'
        ]
    },
    'apartment003': {
        folder: 'apartment003',
        images: [
            '/images/apartment003/images.jpeg',
            '/images/apartment003/Renovated-Madrid-Apartment-01-1-Kindesign.jpg',
            '/images/apartment003/small-apartment-interior-design-200217-934-01-800x420.jpg'
        ]
    },
    'apartment004': {
        folder: 'apartment004',
        images: [
            '/images/apartment004/cdn.cliqueinc.com__cache__posts__222482__paris-home-222482-1493163851063-image.700x0c-5337a287ec2547f6bbd96ece18109fae.jpg',
            '/images/apartment004/images (1).jpeg',
            '/images/apartment004/images.jpeg'
        ]
    },
    'apartment005': {
        folder: 'apartment005',
        images: [
            '/images/apartment005/07_LivingRoom_ApartmentInMachiya_YumikoMikiArchitects_Kenichi_Suzuki.jpg',
            '/images/apartment005/images (2).jpeg',
            '/images/apartment005/tokyo-renovation-i-in-studio-interior_dezeen_2364_col_9-852x568.webp'
        ]
    },
    'house001': {
        folder: 'house001',
        images: [
            '/images/house001/ContentImage3.jpg',
            '/images/house001/images.jpeg',
            '/images/house001/Melt-House-Osaka-Japan-by-SAI-Studio-Yellowtrace-04.jpg'
        ]
    },
    'house002': {
        folder: 'house002',
        images: [
            '/images/house002/294225623.jpg',
            '/images/house002/Agnes-Rudzite-Interiors-1930s-Villa-In-Jurmala-Latvia-Heritage-Interior-Photo-Mikhail-Loskutoff-Yellowtrace.jpg',
            '/images/house002/eklektichnyi-dizayn-v-jurmale-pufikhomes-1-1.jpg'
        ]
    },
    'house003': {
        folder: 'house003',
        images: [
            '/images/house003/images.jpeg',
            '/images/house003/large_BN-SU049_0408HO_GR_20170403184509.jpg',
            '/images/house003/russian-country-home-decorating-style-22.jpg'
        ]
    },
    'house004': {
        folder: 'house004',
        images: [
            '/images/house004/chinese-interior-design-elements-living-room.jpg',
            '/images/house004/images.jpeg',
            '/images/house004/modern-chinese-interior-with-traditional-decor.jpg'
        ]
    },
    'house005': {
        folder: 'house005',
        images: [
            '/images/house005/images (1).jpeg',
            '/images/house005/images.jpeg',
            '/images/house005/Melissa-and-Miller-Interiors-and-the-Luxurious-London-House-1.jpg'
        ]
    },
    'office001': {
        folder: 'office001',
        images: [
            '/images/office001/images (1).jpeg',
            '/images/office001/images.jpeg',
            '/images/office001/Meadows_Conference_Room_1-700x467.jpg'
        ]
    },
    'office002': {
        folder: 'office002',
        images: [
            '/images/office002/images (1).jpeg',
            '/images/office002/images (2).jpeg',
            '/images/office002/images.jpeg'
        ]
    },
    'office003': {
        folder: 'office003',
        images: [
            '/images/office003/images.jpeg',
            '/images/office003/TwitterHERO.webp',
            '/images/office003/公寓室内-sentosa-cove-akihaus-design-studio-img~1b618fa606ef7cd9_14-4484-1-7218e0c.jpg'
        ]
    },
    'office004': {
        folder: 'office004',
        images: [
            '/images/office004/9a6dbf28366873.55fecbb1be676.jpg',
            '/images/office004/images (1).jpeg',
            '/images/office004/sddefault.jpg'
        ]
    },
    'office005': {
        folder: 'office005',
        images: [
            '/images/office005/1720614841232.png',
            '/images/office005/image_blog11_1416x.webp',
            '/images/office005/images.jpeg'
        ]
    }
};

// Helper to get folder number based on ID
const getFolderNumber = (id: string | number): string => {
    const num = parseInt(id.toString());
    // If id > 5, use modulo to cycle back through available folders
    const folderNum = ((num - 1) % 5) + 1;
    return folderNum.toString().padStart(3, '0');
};

// Get images for a specific property based on type and ID
export const getPropertyImagesById = (type: PropertyType, id: string | number): string[] => {
    const folderNum = getFolderNumber(id);
    const folderKey = `${type}${folderNum}`;
    return propertyImageSets[folderKey]?.images || [];
};

// Get thumbnail for a specific property based on type and ID
export const getPropertyThumbnailById = (type: PropertyType, id: string | number): string => {
    const images = getPropertyImagesById(type, id);
    return images[0] || '';
};

// Legacy functions for backward compatibility
export const getPropertyImages = (propertyType: PropertyType): string[] => {
    // Default to first set of each type
    return getPropertyImagesById(propertyType, '001');
};

export const getPropertyThumbnail = (propertyType: PropertyType): string => {
    return getPropertyThumbnailById(propertyType, '001');
};
