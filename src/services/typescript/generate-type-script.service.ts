import { extractAllClassMetaInfos } from './search/extract-class-meta.service';

const parseToTypescript = (source: string) => {
  // 1.
  const classMeta = extractAllClassMetaInfos(source);
  // 2.
  // convert constructor params to private typescript contructor params
  // convert assigments variables into private properties
  // create class
  // create class properties (convert init)
  // create constructor
  // add params
  // init property
  // add class methods
  // return code
};

export { parseToTypescript };
