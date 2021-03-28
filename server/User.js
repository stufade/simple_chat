module.exports = class User {
    userId;
    color;
    userName;
  
    constructor(userId, name) {
      let clr = randomColor();
      
      this.userId = userId;
      this.color = clr;
      this.userName = name;

      function randomColor() {
        let c = '';
    
        while (c.length < 6) {
            c += (Math.random()).toString(16).substr(-6).substr(-1);
        }
    
        return '#' + c;
      }
    }
  }