'use client'
import React, { useState, useMemo, useRef } from 'react';
import { Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from "./strict-mode-droppable";
import { Table } from './table';
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface Field {
  id: string;
  name: string;
  type: string;
  pattern?: string;
}

const fakerTypes = [
  "uuid", "first name", "last name", "email", "phone", "street address", "date", "int",
  "boolean", "color", "company name", "paragraph", "url"
];

const patternTypes = ["date", "number", "phone"];

const DataGenerator = () => {
  const [fields, setFields] = useState<Field[]>([
    { id: '1', name: '', type: '', pattern: '' },
    { id: '2', name: '', type: '', pattern: '' },
    { id: '3', name: '', type: '', pattern: '' },
    { id: '4', name: '', type: '', pattern: '' }
  ]);
  const [numItems, setNumItems] = useState<number | ''>('');
  const [generatedData, setGeneratedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [tableName, setTableName] = useState('');
  const numItemsInputRef = useRef<HTMLInputElement>(null);

  const addField = (index: number) => {
    const newFields = [...fields];
    newFields.splice(index + 1, 0, { id: `field-${Date.now()}`, name: '', type: '', pattern: '' });
    setFields(newFields);
  };

  const removeField = (index: number) => {
    if (fields.length > 1) {
      const newFields = fields.filter((_, i) => i !== index);
      setFields(newFields);
    }
  };

  const updateField = (index: number, key: keyof Field, value: string) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFields(items);
  };

  const numItemsNotValid = (numItems: number | '') => {
    return numItems === '' || numItems <= 0 || numItems > 5000;
  }

  const handleGenerate = async () => {
    
    if(numItemsNotValid(numItems)){
      alert('Please, introduce a valid number of items.');
      numItemsInputRef.current?.focus();
      setNumItems('');
      return;
    };
    
    const emptyFieldNames = fields.some(field => field.name.trim() === '');
    
    if (emptyFieldNames) {
      alert('Please, ensure that all field names are defined.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields, numItems }),
      });

      if (!response.ok) {
        throw new Error('Error generating data');
      }
      
      const generatedData = await response.json();
      setGeneratedData(generatedData);
      console.log('Datos generados:', generatedData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (format: string) => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields, data: generatedData, format, tableName }),
      });

      if (!response.ok) {
        throw new Error(`Error exporting ${format.toUpperCase()}`);
      }

      const {responseString, fileName, contentType} = await response.json();
      const blob = new Blob([responseString], { type: contentType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleExportSQL = () => {
    setIsExportDialogOpen(true);
  };

  const exportToSQL = async () => {
    if (!tableName.trim()) {
      alert('Por favor, introduce un nombre de tabla válido.');
      return;
    }

    await exportData('sql');
    setIsExportDialogOpen(false);
    setTableName('');
  };

  const memoizedFakerTypes = useMemo(() => fakerTypes, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold mb-6 hidden">Test data generator</h1>
      <div className='flex flex-col items-start justify-start gap-2'>
        {/* <Label htmlFor="numItems">Number of items to generate:</Label> */}
        <Input
          type="number"
          value={numItems}
          onChange={(e) => setNumItems(e.target.value ? parseInt(e.target.value) : '')}
          placeholder="Number of items (0-5000)"
          className="border-transparent dark:bg-gray-800 dark:text-white w-1/2"
          ref={numItemsInputRef}
        />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="h-5 w-5 dark:text-gray-400" />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => addField(index)}
                        className="flex-shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Input
                        className="flex-grow dark:bg-gray-800 dark:text-white border-transparent dark:placeholder-gray-400"
                        placeholder="Field name"
                        required
                        value={field.name}
                        onChange={(e) => updateField(index, 'name', e.target.value)}
                      />
                      <Select
                        value={field.type}
                        onValueChange={(value) => updateField(index, 'type', value)}
                      >
                        <SelectTrigger className="w-[180px] dark:bg-gray-800 dark:text-white border-transparent">
                          <SelectValue placeholder="Data type" />
                        </SelectTrigger>
                        <SelectContent className="max-h-40 dark:bg-gray-800 dark:text-white">
                          {memoizedFakerTypes.map((type: any) => (
                            <SelectItem key={type} value={type} className="text-white">
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {patternTypes.includes(field.type) && (
                        <Input
                          className="flex-grow dark:bg-gray-800 dark:text-white placeholder-gray-400"
                          placeholder="Pattern"
                          value={field.pattern}
                          onChange={(e) => updateField(index, 'pattern', e.target.value)}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeField(index)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4 dark:text-gray-400" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      <Button
        onClick={handleGenerate}
        className={`mt-4`}
      >
         {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 color="black" className="animate-spin" />
            <span>Generating...</span>
          </div>
        ) : (
          <span>Generate Data</span>
        )}
      </Button>

      {generatedData.length > 0 && (
        <>
          <div className="flex space-x-2 mt-4">
            <Button onClick={() => exportData('csv')}>Export CSV</Button>
            <Button onClick={() => exportData('json')}>Export JSON</Button>
            <Button onClick={handleExportSQL}>Export SQL</Button>
          </div>
          <Table data={generatedData} columns={fields.map(field => field.name)} /> 
        </>
      )}

      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle>Export to SQL</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tableName" className="text-right dark:text-white">
                Table name:
              </Label>
              <Input
                id="tableName"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="dark:bg-gray-800 dark:text-white border-transparent col-span-3 dark:placeholder-gray-400"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={exportToSQL}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataGenerator;