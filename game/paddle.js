module.exports = function(name) {

	function PaddleObject(name) {
		this.name = name;
		this.s_width= 16;
		this.height= 150;
		this.posy=300;
		this.score=0;
		this.moveup = function(amount) {
				if( (this.posy-this.height/2) > 8) {
					this.posy-=amount;
				}
			};
		this.movedown = function(amount) {
				if( (this.posy+this.height/2) < 600-8) {
					this.posy+=amount;
				}
			};
		this.incScore = function() {
			this.score++;
			console.log(this.name + " scored : " + this.score);
		}	
	}
	return new PaddleObject(name);
}