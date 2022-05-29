/* const settingsScreen = (function() {

})();
 */
const gameScreen = (function() {
    
})();

const Player = function (sign, type) {
    let score = 0;
    const getPlayerType = () => {
        type;
    };
    const getSign = () => {
        sign;
    };
    const incrementScore = () => {
        score += 1;
    };
    const getScore = () => {
        score;
    }
    return {getSign, getPlayerType, incrementScore, getScore};
};