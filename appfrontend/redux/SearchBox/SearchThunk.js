// redux/SearchBox/SearchThunk.js

export const searchSuggestionsThunk = async (url, searchTerm, thunkAPI) => {
  try {
    const response = await fetch('http://192.168.x.x:8000/api/allproperty'); // Replace with your local IP
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const properties = await response.json();
    const buyProperties = properties.filter((property) => property.purpose === 'sell');
    return buyProperties;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getFilteredPropertiesThunk = async (url, filters, thunkAPI) => {
  const {
    City = '',
    PropertyType = [],
    minArea = 0,
    maxArea = Infinity,
    minPrice = 0,
    maxPrice = Infinity,
    noOfBedrooms = [],
    verifiedProperties = false,
    withPhotos = false,
    reraApproved = false,
    amenities = [],
    availabilityStatus = [],
    postedBy = [],
    furnitureType = [],
    purchaseType = [],
    searchproperties = [],
  } = filters;

  try {
    let properties = [];

    if (filters.url && filters.url !== '') {
      const response = await fetch(filters.url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      properties = await response.json();
    } else {
      properties = searchproperties;
    }

    const filteredProperties = properties.filter((property) => {
      const isCityMatch =
        City === '' || City === 'None' || property.city?.toLowerCase() === City.toLowerCase();

      const isPropertyTypeMatch =
        PropertyType.length === 0 || PropertyType.includes(property.type);

      const isAreaMatch = property.area >= minArea && property.area <= maxArea;

      const isPriceMatch = property.price >= minPrice && property.price <= maxPrice;

      const isNoOfBedroomsMatch =
        noOfBedrooms.length === 0 || noOfBedrooms.includes(property.Bhk);

      const isVerified =
        !verifiedProperties || (property.verification === 'verified' && verifiedProperties);

      const isWithPhotos =
        !withPhotos || (property.images && property.images.length > 0);

      const isReraApproved =
        !reraApproved ||
        property.rera_approved === true ||
        property.reraApproved === true;

      const hasAmenities =
        amenities.length === 0 ||
        (property.amenities &&
          amenities.every((am) => property.amenities.includes(am)));

      const isAvailabilityStatusMatch =
        availabilityStatus.length === 0 ||
        (property.availabilityStatus &&
          availabilityStatus.includes(property.availabilityStatus));

      const isPostedByMatch =
        postedBy.length === 0 || (property.postedBy && postedBy.includes(property.postedBy));

      const isFurnitureTypeMatch =
        furnitureType.length === 0 ||
        (property.furnitureType && furnitureType.includes(property.furnitureType));

      const isPurchaseTypeMatch =
        purchaseType.length === 0 ||
        (property.purchaseType && purchaseType.includes(property.purchaseType));

      return (
        isCityMatch &&
        isPropertyTypeMatch &&
        isAreaMatch &&
        isPriceMatch &&
        isNoOfBedroomsMatch &&
        isVerified &&
        isWithPhotos &&
        isReraApproved &&
        hasAmenities &&
        isAvailabilityStatusMatch &&
        isPostedByMatch &&
        isFurnitureTypeMatch &&
        isPurchaseTypeMatch
      );
    });

    return filteredProperties;
  } catch (error) {
    console.error('Error filtering properties:', error);
    throw error;
  }
};
