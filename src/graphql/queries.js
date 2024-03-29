import gql from 'graphql-tag';

export const locationsBboxQuery = gql`
  query getLocations(
    $locale: AvailableLocale! = NL
    $xMax: Float! = 50.86539880176159
    $xMin: Float! = 50.89383019358425
    $yMax: Float! = 4.726524353027345
    $yMin: Float! = 4.675369262695313
    $organisationTypeCode: [String]
    $circufixCategory: [String]
    $ecoCheques: [String]
  ) {
    locations: locationsBbox(
      locale: $locale
      xMax: $xMax
      xMin: $xMin
      yMax: $yMax
      yMin: $yMin
      organisationTypeCode: $organisationTypeCode
      circufixCategory: $circufixCategory
      ecoCheques: $ecoCheques
    ) {
      address {
        countryCode
        formatted
      }
      landingPage
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
      circufixCategory
      ecoCheques
    }
  }
`;

export const locationsQuery = gql`
  query getLocations($locale: AvailableLocale! = NL, $search: String) {
    locations: locations(locale: $locale, search: $search) {
      id
      name
      geometry {
        coordinates
        type
      }
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

export const ordsEcoCheques = gql`
  query getEcoCheques {
    ecoCheques: ecoCheques {
        id
        code
    }
  }
`;
