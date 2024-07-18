export const CATEGORY_LISTS = [
  {
    category: 'user',
    lists: [
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
        list: 'pgsql-docs',
        description: 'Discussion regarding PostgreSQL documentation.',
      },
    ],
  },
];
