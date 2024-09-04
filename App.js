// App.js
import React, { useEffect, useState } from 'react';
import Index from './view';
import * as Controller from './controller';
export default function App() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    const fetchNames = async () => {
      const names = await Controller.loadNames();
      setNames(names);
    };
    fetchNames();
  }, []);

  return (
    <NameListView
      names={names}
      onAdd={(name) => Controller.handleAddName(name, setNames)}
      onUpdate={(id, name) => Controller.handleUpdateName(id, name, setNames)}
      onDelete={(id) => Controller.handleDeleteName(id, setNames)}
    />
  );
}
