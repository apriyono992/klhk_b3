import * as fs from 'fs';
import * as path from 'path';

/**
 * Reads the email template and replaces placeholders with corresponding values from the object.
 * @param templatePath Path to the HTML email template.
 * @param replacements Object containing the placeholders as keys and their replacements as values.
 * @returns The email template with all placeholders replaced by their respective values.
 */
export function replaceTemplate(
  templatePath: string,
  replacements: { [key: string]: any },
): string {
  // Read the HTML template from the file system
  let template = fs.readFileSync(templatePath, 'utf-8');

  // Loop over each key in the replacements object and replace in the template
  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(placeholder, value);
  }

  return template;
}
