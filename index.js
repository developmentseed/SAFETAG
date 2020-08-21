const fs = require('fs-extra');
const path = require('path');
const frontmatter = require('@github-docs/frontmatter');

const sourcePath = '/Users/vgeorge/dev/safetag/content-backup/en';
const targetPath = path.join(__dirname, 'content');
const targetActivitiesPath = path.join(targetPath, 'activities');
const targetMethodsPath = path.join(targetPath, 'methods');

let activitiesTitles = [];

const fixArrayField = (field) => {
  return (field || []).reduce((acc, a) => {
    return acc
      .concat(a.split(','))
      .map((a) => a.trim())
      .filter((a) => !['unknown', 'N/A'].includes(a));
  }, []);
};

async function parseActivities() {
  await fs.ensureDir(targetActivitiesPath);

  const exercisesPath = path.join(sourcePath, 'exercises');
  const exercises = await fs.readdir(exercisesPath);

  // Process exercises
  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i];

    const sourcePath = path.join(exercisesPath, exercise);

    // If not a directory, skip
    const fileStats = await fs.stat(sourcePath);
    if (!fileStats.isDirectory()) continue;

    const fileContent = await fs.readFile(
      path.join(exercisesPath, exercise, 'index.md'),
      'utf-8'
    );

    const { data, content: body } = frontmatter(fileContent);

    const content = body.split('\n');

    // Get title
    let title;
    for (let l = 0; l < content.length; l++) {
      const line = content[l];

      if (line.indexOf('####') > -1) {
        title = line.replace('####', '').replace('\n', '').trim();
        break;
      }
    }

    function parseSection(title) {
      let section = [],
        sectionStart = 99999999;
      for (let l = 0; l < content.length; l++) {
        const line = content[l];

        // Find section start
        if (line.indexOf(`#### ${title}`) > -1) {
          sectionStart = l;
          continue; // skip line
        }

        // If line is after section start
        if (sectionStart && sectionStart <= l) {
          // Stop if line starts a new section
          if (line.indexOf('####') > -1) break;

          // Collect line
          section.push(line);
        }
      }
      return section.join('\n');
    }

    // Keep slug/title to add the relationship to methods
    activitiesTitles.push({
      slug: exercise,
      title,
    });

    const output = frontmatter.stringify('', {
      title,
      approaches: fixArrayField(data['Approach']),
      authors: fixArrayField(data['Authors']),
      remote_options: fixArrayField(data['Remote_options']),
      skills_required: fixArrayField(data['Skills_required']),
      skills_trained: fixArrayField(data['Skills_trained']),
      organization_size_under: data['Org_size_under']
        ? data['Org_size_under'][0]
        : null,
      time_required_minutes: data['Time_required_minutes']
        ? data['Time_required_minutes'][0]
        : null,
      summary: parseSection('Summary'),
      overview: parseSection('Overview'),
      materials_needed: parseSection('Materials Needed'),
      considerations: parseSection('Considerations'),
      walk_through: parseSection('Walkthrough'),
      recommendations: parseSection('Recommendations'),
    });

    const outputFilePath = path.join(targetActivitiesPath, `${exercise}.md`);

    await fs.writeFile(outputFilePath, output, 'utf-8');
  }
}

async function parseMethods() {
  await fs.ensureDir(targetMethodsPath);

  const methodsPath = path.join(sourcePath, 'methods');
  const methods = await fs.readdir(methodsPath);

  // Process methods
  for (let i = 0; i < methods.length; i++) {
    const method = methods[i];
    const output = {};

    const methodPath = path.join(methodsPath, method);

    // If not a directory, skip
    const fileStats = await fs.stat(methodPath);
    if (fileStats.isFile()) continue;

    // Check if it has related activities
    const activitiesFile = path.join(methodPath, 'activities.md');
    const hasActivities = await fs.exists(activitiesFile);
    if (hasActivities) {
      let activitiesContent = await fs.readFile(activitiesFile, 'utf-8');

      // Extract activity ids
      output.activities = activitiesContent
        .split('\n')
        .filter((l) => l.indexOf('!INCLUDE') > -1) // get lines with includes
        .map((l) => l.split('exercises/')[1]) // discard text before slug
        .map((l) => l.split('/')[0]) // get slug, if directory
        .map((l) => l.split('.md')[0]) // get slug, if .md file
        .map((l) => activitiesTitles.find((a) => a.slug === l).title);
    }

    // Get Metadata
    const metadataFilePath = `${methodPath}.guide.md`;
    const metadataFileContent = await fs.readFile(metadataFilePath, 'utf-8');

    const { data } = frontmatter(metadataFileContent);

    output.authors = data.Authors || [];
    output.info_provided = fixArrayField(data.Info_provided);
    output.info_required = fixArrayField(data.Info_required);

    // Parse section files
    const sections = [
      'summary',
      'purpose',
      'guiding_questions',
      'approaches',
      'outputs',
      'operations_security',
      'preparation',
    ];

    // Get sections
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionFilePath = path.join(methodPath, `${section}.md`);

      if (!(await fs.exists(sectionFilePath))) continue;

      const sectionContent = await fs.readFile(sectionFilePath, 'utf-8');
      output[section] = sectionContent;
    }

    const outputFilePath = path.join(targetMethodsPath, `${method}.md`);

    await fs.writeFile(
      outputFilePath,
      frontmatter.stringify('', output),
      'utf-8'
    );
  }
}

async function main() {
  await parseActivities();
  await parseMethods();
}

main();
