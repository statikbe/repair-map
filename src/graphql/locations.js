import gql from 'graphql-tag';

export const locationsQuery = gql`
  query getLocations(
    $locale: AvailableLocale! = NL
    $xMax: Float! = 50.86539880176159
    $xMin: Float! = 50.89383019358425
    $yMax: Float! = 4.726524353027345
    $yMin: Float! = 4.675369262695313
  ) {
    locations: locationsBbox(locale: $locale, xMax: $xMax, xMin: $xMin, yMax: $yMax, yMin: $yMin) {
      address {
        city
        country
        countryCode
        formatted
        number
        postalCode
        street
      }
      contactsEmail
      contactsPhone
      contactsWebsite
      geometry {
        coordinates
        type
      }
      id
      locale
      name
      organisationDescription
      organisationTypeCode
    }
  }
`;
