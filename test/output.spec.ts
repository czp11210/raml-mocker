import test from 'ava';
import Output from '@/output';
import OutputRequest from '@/models/output-request';

test('When message one line , then title is message', (t) => {
  const message = 'abc';
  const [, title] = Output.processMessage(message);
  t.is(title, message);
});

test('When message multiple line , then title is first line', (t) => {
  const expectTitle = 'the first line';
  const expectValidInfo = `and this is next line
  and this is last line`;
  const message = `${expectTitle}
${expectValidInfo}`;
  const [, title, validInfo] = Output.processMessage(message);
  t.is(title, expectTitle);
  t.is(validInfo, expectValidInfo);
});

test('Give push error , then get failCount 1', (t) => {
  const failCount = 1;
  const output = new Output('host');
  const outputRequest: OutputRequest =
      new OutputRequest({ path: '', method: '' });
  output.push(Output.ERROR, outputRequest);
  t.is(output.failCount, failCount);
  t.is(output.successCount, 0);

  output.push(Output.SUCCESS, outputRequest);
  t.is(output.successCount, 1);
});
