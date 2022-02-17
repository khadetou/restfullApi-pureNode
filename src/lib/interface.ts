import { Callback, DataCallBack } from './types';

export interface Callbacks {
	[key: string]: (data: any, callback: Callback) => void;
}

export interface Lib {
	create: (dir: string, file: string, data: any, callback: DataCallBack) => void;
	update: (dir: string, file: string, data: any, callback: DataCallBack) => void;
	read: (dir: string, file: string, callback: DataCallBack) => void;
	delete: (dir: string, file: string, callback: DataCallBack) => void;
	basedir: string;
}
