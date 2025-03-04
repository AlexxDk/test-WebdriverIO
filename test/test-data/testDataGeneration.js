import { faker } from '@faker-js/faker'

export class TestDataGeneration {

    randomFirstName() {
        return faker.person.firstName()
    }

    randomLastName() {
        return faker.person.lastName()
    }

    randomZipCode() {
        return faker.address.zipCode()
    }

}

export default new TestDataGeneration();