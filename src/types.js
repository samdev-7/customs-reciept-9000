export const FIELD_DEFINITIONS = [
  { csvKey: 'Recipient', templateKey: 'Recipient', label: 'Recipient' },
  { csvKey: 'Company', templateKey: 'Company', label: 'Company' },
  { csvKey: 'Email', templateKey: 'Email', label: 'Email' },
  { csvKey: 'Tracking Number', templateKey: 'TrackingNumber', label: 'Tracking Number' },
  { csvKey: 'Cost', templateKey: 'Cost', label: 'Cost' },
  { csvKey: 'Status', templateKey: 'Status', label: 'Status' },
  { csvKey: 'Error Message', templateKey: 'ErrorMessage', label: 'Error Message' },
  { csvKey: 'Ship Date', templateKey: 'ShipDate', label: 'Ship Date' },
  { csvKey: 'Label Created Date', templateKey: 'LabelCreatedDate', label: 'Label Created Date' },
  { csvKey: 'Estimated Delivery Time', templateKey: 'EstimatedDeliveryTime', label: 'Estimated Delivery Time' },
  { csvKey: 'Weight (oz)', templateKey: 'WeightOz', label: 'Weight (oz)' },
  { csvKey: 'Zone', templateKey: 'Zone', label: 'Zone' },
  { csvKey: 'Package Length', templateKey: 'PackageLength', label: 'Package Length' },
  { csvKey: 'Package Width', templateKey: 'PackageWidth', label: 'Package Width' },
  { csvKey: 'Package Height', templateKey: 'PackageHeight', label: 'Package Height' },
  { csvKey: 'Tracking Status', templateKey: 'TrackingStatus', label: 'Tracking Status' },
  { csvKey: 'Tracking Info', templateKey: 'TrackingInfo', label: 'Tracking Info' },
  { csvKey: 'Tracking Date', templateKey: 'TrackingDate', label: 'Tracking Date' },
  { csvKey: 'Address Line 1', templateKey: 'AddressLine1', label: 'Address Line 1' },
  { csvKey: 'Address Line 2', templateKey: 'AddressLine2', label: 'Address Line 2' },
  { csvKey: 'City', templateKey: 'City', label: 'City' },
  { csvKey: 'State', templateKey: 'State', label: 'State' },
  { csvKey: 'Zipcode', templateKey: 'Zipcode', label: 'Zipcode' },
  { csvKey: 'Country', templateKey: 'Country', label: 'Country' },
  { csvKey: 'Carrier', templateKey: 'Carrier', label: 'Carrier' },
  { csvKey: 'Service', templateKey: 'Service', label: 'Service' },
  { csvKey: 'Order ID', templateKey: 'OrderID', label: 'Order ID' },
  { csvKey: 'Rubber Stamp 1', templateKey: 'RubberStamp1', label: 'Rubber Stamp 1' },
  { csvKey: 'Rubber Stamp 2', templateKey: 'RubberStamp2', label: 'Rubber Stamp 2' },
  { csvKey: 'Rubber Stamp 3', templateKey: 'RubberStamp3', label: 'Rubber Stamp 3' },
  { csvKey: 'Phone', templateKey: 'Phone', label: 'Phone' },
];

export function createEmptyFormData() {
  const data = {};
  FIELD_DEFINITIONS.forEach(field => {
    data[field.templateKey] = '';
  });
  return data;
}

export function csvRowToFormData(csvRow) {
  const data = {};
  FIELD_DEFINITIONS.forEach(field => {
    data[field.templateKey] = csvRow[field.csvKey] ?? '';
  });
  return data;
}
