// controllers/NameController.js
import * as Controller from "../model/database";

export const loadNames = async () => {
	await Controller.createTable();
	const names = await Controller.getNames();
	return names;
};

export const handleAddName = async (name, setNames) => {
	const id = await Controller.addName(name);
	const newNames = await Controller.getNames();
	setNames(newNames);
};

export const handleUpdateName = async (id, name, setNames) => {
	await Controller.updateName(id, name);
	const updatedNames = await Controller.getNames();
	setNames(updatedNames);
};

export const handleDeleteName = async (id, setNames) => {
	await Controller.deleteName(id);
	const remainingNames = await Controller.getNames();
	setNames(remainingNames);
};
