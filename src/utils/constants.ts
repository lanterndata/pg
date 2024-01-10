// ----------------------------------------------------
// Dates
// ----------------------------------------------------

const EARLEST_YEAR = 2023;
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

const getDates = () => {
  const dates = [];
  for (let year = EARLEST_YEAR; year <= CURRENT_YEAR; year++) {
    const endMonth = year === CURRENT_YEAR ? CURRENT_MONTH : 12;
    for (let month = 1; month <= endMonth; month++) {
      dates.push(year + '-' + month.toString().padStart(2, '0'));
    }
  }
  return dates;
};

// ----------------------------------------
// Lists
// ----------------------------------------

export const CATEGORY_LISTS = [
  {
    category: 'user',
    lists: [
      {
        list: 'pgsql-admin',
        description:
          'PostgreSQL administration (excludes pgAdmin application support, which can be found on the pgadmin-support list)',
      },
      {
        list: 'pgsql-advocacy',
        description:
          'Coordinates people working on promoting PostgreSQL, organizing user groups, and dealing with PostgreSQL marketing and PR. Also a good place to ask for presentations and flyers if you need them.',
      },
      {
        list: 'pgsql-announce',
        description:
          'Announcement list pertaining to PostgreSQL and various third party software.',
      },
      {
        list: 'pgsql-general',
        description:
          "General discussion area for users. Apart from compile, acceptance test, and bug problems, most new users will probably only be interested in this mailing list (unless they want to contribute to development or documentation). All non-bug related questions regarding PostgreSQL's version of SQL, and all installation related questions that do not involve bugs or failed compiles, should be restricted to this area. Please note that many of the developers monitor this area.",
      },
      {
        list: 'pgsql-interfaces',
        description:
          'Discussion of PostgreSQL interfaces, except JDBC and ODBC.',
      },
      {
        list: 'pgsql-jobs',
        description: 'Posting of PostgreSQL related jobs.',
      },
      {
        list: 'pgsql-novice',
        description: 'No question is too simple for this list.',
      },
      {
        list: 'pgsql-performance',
        description:
          "Discussion of PostgreSQL's performance issues. Please see Guide to reporting problems and Slow Query Questions for some tips on how to write your performance question.",
      },
      {
        list: 'pgsql-sql',
        description: 'Discussion for users on SQL related matters.',
      },
      {
        list: 'pgsql-women',
        description:
          'Discussion about how to increase the number of women in the PostgreSQL international community. All genders welcome.',
      },
    ],
  },
  {
    category: 'developer',
    lists: [
      {
        list: 'buildfarm-members',
        description: 'Discussion list for buildfarm animal caretakers',
      },
      {
        list: 'pgsql-bugs',
        description: 'If you find a bug, please use the bug reporting form.',
      },
      {
        list: 'pgsql-committers',
        description:
          'Notification of git commits are sent to this list. Do not post here!',
      },
      {
        list: 'pgsql-docs',
        description: 'Discussion regarding PostgreSQL documentation.',
      },
      {
        list: 'pgsql-gui-dev',
        description: 'Development of GUI tools for use with PostgreSQL',
      },
      {
        list: 'pgsql-hackers',
        description:
          'The PostgreSQL developers team lives here. Discussion of current development issues, problems and bugs, and proposed new features. If your question cannot be answered by people in the other lists, and it is likely that only a developer will know the answer, you may re-post your question in this list. You must try elsewhere first!',
      },
      {
        list: 'pgsql-perffarm',
        description: 'pgsql-perffarm',
      },
      {
        list: 'pgsql-translators',
        description: 'Translation announcements, coordination and discussions',
      },
      {
        list: 'pgsql-www',
        description:
          'Discussion of development and coordination of the PostgreSQL websites.',
      },
    ],
  },
  {
    category: 'project',
    lists: [
      {
        list: 'pgadmin-hackers',
        description: 'pgAdmin development and patches.',
      },
      {
        list: 'pgadmin-support',
        description: 'pgAdmin support questions.',
      },
      {
        list: 'pgsql-jdbc',
        description: "Discussion of PostgreSQL's Java interface, JDBC.",
      },
      {
        list: 'pgsql-jdbc-commits',
        description: 'JDBC driver commit messages',
      },
      {
        list: 'pgsql-odbc',
        description: "Discussion of PostgreSQL's ODBC interface.",
      },
      {
        list: 'pgsql-pkg-debian',
        description: 'Discussion of Debian packaging',
      },
      {
        list: 'pgsql-pkg-yum',
        description: 'YUM packaging',
      },
      {
        list: 'pljava-dev',
        description: 'PL/Java development',
      },
      {
        list: 'psycopg',
        description: 'Discussion about the Python interface Psycopg',
      },
      {
        list: 'wal-g',
        description: 'Discussion about the WAL-G backup tool',
      },
    ],
  },
];

export const LISTS = CATEGORY_LISTS.flatMap((category) =>
  category.lists.map((list) => list.list)
);

// ----------------------------------------
// List and dates
// ----------------------------------------

export const getListAndDateTuples = () => {
  const listAndDateTuples = [];
  for (const list of LISTS) {
    for (const date of getDates()) {
      listAndDateTuples.push({ list, date });
    }
  }
  return listAndDateTuples;
};
