import { NextRequest, NextResponse } from 'next/server';

const replaceSpacesWithUnderscores = (str: string) => {
  return str.replace(/\s+/g, '_');
};

export async function POST(request: NextRequest) {
  const { fields, data, format, tableName } = await request.json();

  let responseString = '';
  let contentType = '';
  let fileName = '';

  switch (format) {
    case 'csv':
      responseString = [
        fields.map((field: any) => field.name).join(","), // Headers
        ...data.map((item: any) => fields.map((field: any) => item[field.name]).join(","))
      ].join("\n");
      contentType = 'text/csv';
      fileName = 'data.csv';
      break;

    case 'json':
      responseString = JSON.stringify(data, null, 2);
      contentType = 'application/json';
      fileName = 'data.json';
      break;

    case 'sql':
      if (!tableName.trim()) {
        return new NextResponse('Invalid table name', { status: 400 });
      }
      responseString = data.map((item: any) => {
        const columns = fields.map((field: any) => replaceSpacesWithUnderscores(field.name)).join(", ");
        const values = fields.map((field: any) => `"${item[field.name]}"`).join(", ");
        return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
      }).join("\n");
      contentType = 'text/sql';
      fileName = `${tableName}.sql`;
      break;

    default:
      return new NextResponse('Invalid format', { status: 400 });
  }

  return new NextResponse(JSON.stringify({responseString, fileName, contentType}), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
