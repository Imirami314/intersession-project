#THIS IS FAKE DO NOT LOOK AT THIS PLEASEEEEEEEE

import googlemaps
from datetime import datetime

from numpy import outer

gmaps = googlemaps.Client(key='krug')

# Geocoding an address
geocode_result = gmaps.geocode('1200 Villa Street, Mountain View, CA')

# Look up an address with reverse geocoding
reverse_geocode_result = gmaps.reverse_geocode((40.714224, -73.961452))

# Request directions via public transit
now = datetime.now()
directions_result = gmaps.directions("Sydney Town Hall",
                                     "Parramatta, NSW",
                                     mode="transit",
                                     departure_time=now)

# Validate an address with address validation
addressvalidation_result =  gmaps.addressvalidation(['1600 Amphitheatre Pk'], 
                                                    regionCode='US',
                                                    locality='Mountain View', 
                                                    enableUspsCass=True)


print(f'{geocode_result[0]["geometry"]["location"]["lat"]}, {geocode_result[0]["geometry"]["location"]["lng"]}')

# Get an Address Descriptor of a location in the reverse geocoding response
#address_descriptor_result = gmaps.reverse_geocode((40.714224, -73.961452), enable_address_descriptor=True)


