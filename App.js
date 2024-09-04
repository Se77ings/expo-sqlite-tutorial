import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button, Platform } from "react-native";
import * as SQLite from "expo-sqlite";
import { useState, useEffect } from "react";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";


// expo
// expo-document-picker
// expo-file-system
// expo-sharing
// expo-sqlite
// expo-status-bar
// react
// react-native


export default function App() {
	const [db, setDb] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [names, setNames] = useState([]);
	const [currentName, setCurrentName] = useState("");

	useEffect(() => {
		const initDb = async () => {
			const database = await SQLite.openDatabaseAsync("example.db");
			setDb(database);

			await database.execAsync(`
        CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
      `);

			const allNames = await database.getAllAsync("SELECT * FROM names");
			setNames(allNames);

			setIsLoading(false);
		};

		initDb();
	}, []);

	const addName = async () => {
		if (currentName.trim()) {
			const result = await db.runAsync("INSERT INTO names (name) values (?)", currentName);
			setNames([...names, { id: result.lastInsertRowId, name: currentName }]);
			setCurrentName("");
		}
	};

	const deleteName = async (id) => {
		const result = await db.runAsync("DELETE FROM names WHERE id = ?", id);
		if (result.changes > 0) {
			setNames(names.filter((name) => name.id !== id));
		}
	};

	const updateName = async (id) => {
		if (currentName.trim()) {
			const result = await db.runAsync("UPDATE names SET name = ? WHERE id = ?", currentName, id);
			if (result.changes > 0) {
				setNames(names.map((name) => (name.id === id ? { id, name: currentName } : name)));
				setCurrentName("");
			}
		}
	};

	const exportDb = async () => {
		if (Platform.OS === "android") {
			const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
			if (permissions.granted) {
				const base64 = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + "SQLite/example.db", {
					encoding: FileSystem.EncodingType.Base64,
				});

				await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, "example.db", "application/octet-stream")
					.then(async (uri) => {
						await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
					})
					.catch((e) => console.log(e));
			} else {
				console.log("Permission not granted");
			}
		} else {
			await Sharing.shareAsync(FileSystem.documentDirectory + "SQLite/example.db");
		}
	};

	const importDb = async () => {
    console.log("asap")
		let result = await DocumentPicker.getDocumentAsync({
			copyToCacheDirectory: true,
		});
    console.log(result)

		if (result.canceled === false) {
			setIsLoading(true);

			if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite")).exists) {
        console.log("Directory does not exist")
				await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite");
			}else{
        console.log("Directory already exists")
      }

			const base64 = await FileSystem.readAsStringAsync(result.uri, {
				encoding: FileSystem.EncodingType.Base64,
			});
      console.log(base64)

			await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "SQLite/example.db", base64, { encoding: FileSystem.EncodingType.Base64 });
			await db.closeAsync();
			const database = await SQLite.openDatabaseAsync("example.db");
			setDb(database);
			const allNames = await database.getAllAsync("SELECT * FROM names");
			setNames(allNames);
			setIsLoading(false);
		}
	};

	const ShowNames = () => {
		return names.map((name, index) => {
			return (
				<View
					key={index}
					style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
					<Text>{name.name}</Text>
					<Button
						title="Delete"
						onPress={() => deleteName(name.id)}
					/>
					<Button
						title="Update"
						onPress={() => updateName(name.id)}
					/>
				</View>
			);
		});
	};

	return (
		<View style={styles.container}>
			<TextInput
				value={currentName}
				placeholder="name"
				onChangeText={setCurrentName}
			/>
			<Button
      
				title="Add Name"
				onPress={addName}
			/>
			{ShowNames()}
			<Button
				title="Export Db"
				onPress={exportDb}
			/>
			<Button
				title="Import Db"
				onPress={importDb}
			/>
			<StatusBar style="auto" />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		alignSelf: "stretch",
		justifyContent: "space-between",
		margin: 8,
	},
});
