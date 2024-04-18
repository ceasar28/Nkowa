export const allFeaturesMarkup = async (userName: string, nkowaId: any) => {
  return {
    message: `Hi ${userName}, kedu! 👋, Welcome to Nkọwa bot your go to Retrieval-augmented generation bot. Here is what I can do:\n\n– Help you summarize any pdf 📄.\n– Interactive Conversation 💬 with your PDF.\n– Generate unique 🌟 content out of your pdf.\n\nthis is your Nkọwa id: <code>${nkowaId}</code>\n\nShall we start? 👇`,
    keyboard: [
      [
        {
          text: '📁 Upload PDF',
          callback_data: JSON.stringify({
            command: '/fileUpload',
            language: 'english',
          }),
        },
        {
          text: 'Upload PDF URL 🔗',
          callback_data: JSON.stringify({
            command: '/fileUploadUrl',
            language: 'english',
          }),
        },
      ],
      [
        {
          text: 'View Files 📂',
          callback_data: JSON.stringify({
            command: '/viewFiles',
            language: 'english',
          }),
        },
        {
          text: 'Visit Akwụkwọ Our Digital Library 📚',
          url: 'https://nkowa.vercel.app/',
        },
      ],
      [
        {
          text: '📢 Share',
          language: 'english',
          switch_inline_query:
            'Nkọwa is Retrieval-augmented generation bot, that gives the interactive feature with your documents, test books and articles.',
        },
      ],
    ],
  };
};
