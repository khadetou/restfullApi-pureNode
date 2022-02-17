/**
 * 
 * Library for storing and editing data.
 * 
 */

import fs from 'fs';
import path from 'path';
import { Lib } from './interface';

const lib: Lib = {
	create: () => {},
	read: () => {},
	update: () => {},
	delete: () => {},
	basedir: ''
};

//Base of the data folder
lib.basedir = path.join(__dirname, '/../.data/');
console.log(lib.basedir);

//Write data to a file aka CREATE
lib.create = (dir, file, data, callback) => {
	//open the file for writing
	fs.open(lib.basedir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			//Convert data to json object
			const stringData = JSON.stringify(data);

			//Write to file and close it
			fs.writeFile(fileDescriptor, stringData, (err) => {
				if (!err) {
					fs.close(fileDescriptor, (err) => {
						if (!err) {
							callback(false);
						} else {
							callback('Error closing new file');
						}
					});
				} else {
					callback('Error writing to file');
				}
			});
		} else {
			callback('Could not create new file, it may already exist' + err);
		}
	});
};

//Read data from a file
lib.read = (dir, file, callback) => {
	fs.readFile(lib.basedir + dir + '/' + file + '.json', 'utf8', (err, data) => {
		callback(err, data);
	});
};

//Update data in a file
lib.update = (dir, file, data, callback) => {
	//Open the file for writing
	fs.open(lib.basedir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			//Convert data to string
			const stringData = JSON.stringify(data);

			//Truncate the file
			fs.ftruncate(fileDescriptor, (err) => {
				if (!err) {
					//write the file and close it
					fs.writeFile(fileDescriptor, stringData, (err) => {
						if (!err) {
							fs.close(fileDescriptor, (err) => {
								if (!err) {
									callback(false);
								} else {
									callback('Erro closing the file');
								}
							});
						} else {
							callback('Error writing to existing file');
						}
					});
				} else {
					callback('Error Truncating file');
				}
			});
		} else {
			callback('Could not open file for updating, it may not exist yet');
		}
	});
};

//Delete a file
lib.delete = (dir, file, callback) => {
	//Unlink the file
	fs.unlink(lib.basedir + dir + '/' + file + '.json', (err) => {
		if (!err) {
			callback(false);
		} else {
			callback('Error deleting file');
		}
	});
};

export default lib;
