
class MathUtility {
	static average(numbers: number[]): number {
		if (numbers.length <= 0) {
			return NaN;
		}
		const sum = MathUtility.sum(numbers);
		return sum / numbers.length;
	}

	static standardDeviation(numbers: number[]): number {
		if (numbers.length <= 0) {
			return NaN;
		}
		const average = MathUtility.average(numbers);
		let variance = 0;
		numbers.forEach((number) => {
			variance += (number - average) * (number - average);
		});
		return Math.sqrt(variance / numbers.length);
	}

	static sum(numbers: number[]): number {
		let value = 0;
		numbers.forEach((number) => {
			value += number;
		});
		return value;
	}
}

export default class Utility {
	static readonly math = MathUtility;

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
