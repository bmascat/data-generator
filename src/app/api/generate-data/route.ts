import { NextRequest, NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';

const fakerFunctions = {
  uuid: faker.string.uuid,
  'first name': faker.person.firstName,
  'last name': faker.person.lastName,
  email: faker.internet.email,
  phone: faker.phone.number,
  'street address': faker.location.streetAddress,
  date: faker.date.recent,
  int: faker.number.int,
  boolean: faker.datatype.boolean,
  color: faker.color.human,
  'company name': faker.company.name,
  paragraph: faker.lorem.paragraph,
  url: faker.internet.url,
};

export async function POST(request: NextRequest) {
  const { fields, numItems } = await request.json();

  const generatedData = Array.from({ length: numItems }, () => {
    const item: Record<string, any> = {};
    fields.map((field: any) => {
      const fakerFunction = fakerFunctions[field.type as keyof typeof fakerFunctions];
      item[field.name] = fakerFunction ? fakerFunction() : '';
    });
    return item;
  });

  return NextResponse.json(generatedData);
}
