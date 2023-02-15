import gql from 'graphql-tag';

export const locationsQuery = gql`
  query getLocations(
    $locale: AvailableLocale! = NL
    $xMax: Float! = 50.86539880176159
    $xMin: Float! = 50.89383019358425
    $yMax: Float! = 4.726524353027345
    $yMin: Float! = 4.675369262695313
    $organisationTypeCode: [String]
    $productCategory: [String]
  ) {
    locations: locationsBbox(locale: $locale, xMax: $xMax, xMin: $xMin, yMax: $yMax, yMin: $yMin, organisationTypeCode: $organisationTypeCode, productCategory: $productCategory) {
      address {
        countryCode
        formatted
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
      organisationTypeCode
    }
  }
`;

export const ordsStandardQuery = gql`
  query getOrganisationTypes {
    ordsStandard: standard {
        organisationTypes
        productCategories {
          id
          label
        }
    }
  }
`;
