export const welcomeMessageMarkup = async (userName: string) => {
  return {
    message: `Hi ${userName}, kedu! 👋, Welcome to Nkọwa, your go to Retrieval-augmented generation bot. Here is what I can do:\n\n– Help you summarize any Textbook | Article | Research works pdf 📄.\n– Interactive Conversation 💬 with your PDF.\n– Generate unique 🌟 content out of your pdf.\n– I can also give you responses in any Language of your choice\n\n⚠️ I can only take in 5mb max pdf if you are uploading from your device and 15mb max if you are uploading using a viewable url(.pdf extension url) ⚠️\n\n Shall we start? 👇`,
    keyboard: [[{ text: 'Lets get started 🚀', callback_data: '/getStarted' }]],
  };
};
