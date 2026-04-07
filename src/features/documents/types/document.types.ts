export interface Document {
  id: string;
  name: string;
  size: string;
  date: string;
  status: 'Processing' | 'Processed' | 'Error';
  url?: string;
}
