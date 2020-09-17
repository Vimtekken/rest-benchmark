import ElasticSearch from './ElasticSearch';
import { Sample } from './interfaces/Sample';
import { TestSampleConfig } from './interfaces/Tests';

export default function writeSample(
	configName: string,
	testName: string,
	subtest: TestSampleConfig,
	subIndex: number,
	sample: Sample,
): void {
	ElasticSearch.connection?.index({
		index: 'test_sample',
		body: {
			name: configName,
			test: testName,
			subtest_index: subIndex,
			config: subtest,
			sample,
		},
	});
}
