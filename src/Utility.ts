
export default class Utility {
	static sleep(milliseconds: number): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	}

	static stringToBool(someString: string): boolean {
		switch (someString.toLowerCase()) {
		case 'false':
		case 'no':
		case '0':
		case '':
			return false;
		default:
			return true;
		}
	}
}
