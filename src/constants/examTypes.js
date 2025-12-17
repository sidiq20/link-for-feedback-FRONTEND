export const QUESTION_TYPES = {
  MCQ: 'mcq',
  TEXT: 'text',
  MATH: 'math',
  BOOLEAN: 'boolean',
  FILL_BLANK: 'fill_blank',
  IMAGE_LABEL: 'image_label',
  FILE_UPLOAD: 'file_upload',
  MATCH: 'match',
  CODE: 'code'
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.MCQ]: 'Multiple Choice',
  [QUESTION_TYPES.TEXT]: 'Short Answer / Text',
  [QUESTION_TYPES.MATH]: 'Math / Formula',
  [QUESTION_TYPES.BOOLEAN]: 'True / False',
  [QUESTION_TYPES.FILL_BLANK]: 'Fill in the Blank',
  [QUESTION_TYPES.IMAGE_LABEL]: 'Image Labeling',
  [QUESTION_TYPES.FILE_UPLOAD]: 'File Upload',
  [QUESTION_TYPES.MATCH]: 'Match the Following',
  [QUESTION_TYPES.CODE]: 'Code Challenge'
};
