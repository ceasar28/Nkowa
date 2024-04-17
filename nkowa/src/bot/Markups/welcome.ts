export const welcomeMessageMarkup = async (userName: string) => {
  return {
    message: `Hi ${userName}, kedu! 👋, Welcome to Nkọwa, your go to Retrieval-augmented generation bot. Here is what I can do:\n\n– Help you summarize any pdf 📄.\n– Interactive Conversation 💬 with your PDF.\n– Generate unique 🌟 content out of your pdf.\n\nShall we start? 👇`,
    keyboard: [[{ text: 'Lets get started 🚀', callback_data: '/getStarted' }]],
  };
};
