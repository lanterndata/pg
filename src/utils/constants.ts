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
    ],
  },
  {
    category: 'developer',
    lists: [
      {
        list: 'pgsql-bugs',
        description: 'If you find a bug, please use the bug reporting form.',
      },
      {
        list: 'pgsql-docs',
        description: 'Discussion regarding PostgreSQL documentation.',
      },
      {
        list: 'pgsql-hackers',
        description:
          'The PostgreSQL developers team lives here. Discussion of current development issues, problems and bugs, and proposed new features. If your question cannot be answered by people in the other lists, and it is likely that only a developer will know the answer, you may re-post your question in this list. You must try elsewhere first!',
      },
    ],
  },
];
