export const relaxVideos = [
    { id: 'LnJwH_PZXnM', title: 'TED Talk: Confiança' },
    { id: 'XIXvKKEQQJo', title: 'TED Talk: Confiança' },
    { id: 'aImrjNPrh30', title: 'TED Talk: Confiança' },
    { id: 'pN34FNbOKXc', title: 'TED Talk: Confiança' },
    { id: '8jPQjjsBbIc', title: 'TED Talk: Falar em Público' },
    { id: 'eVFzbxmKNUw', title: 'Como ganhar confiança' }
];

export function getRandomVideo() {
    const index = Math.floor(Math.random() * relaxVideos.length);
    return relaxVideos[index];
}
