/**
 * @jsx React.DOM
 */

/**
 * Template init
 * Showdown.js
 */
var converter = new Showdown.converter();



/**
 * Comment
 * The comment itself with its meta
 */
var Comment = React.createClass({
 render: function() {
   var rawMarkup = converter.makeHtml(this.props.children.toString());
   return (
     <div className="comment">
       <h2 className="commentAuthor">
         {this.props.author}
       </h2>
       <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
     </div>
   );
 }
});



/**
 * CommentBox
 * Wrapper for the comment elements
 */
var CommentBox = React.createClass({

 loadCommentsFromServer: function() {
   $.ajax({
     url: this.props.url,
     dataType: 'json',
     success: function(data) {
       this.setState({data: data});
     }.bind(this),
     error: function(xhr, status, err) {
       console.error(this.props.url, status, err.toString());
     }.bind(this)
   });
 },
 handleCommentSubmit: function(comment) {
   var comments = this.state.data;
   comments.push(comment);
   this.setState({data: comments}, function() {
     // `setState` accepts a callback. To avoid (improbable) race condition,
     // `we'll send the ajax request right after we optimistically set the new
     // `state.
     $.ajax({
       url: this.props.url,
       dataType: 'json',
       type: 'POST',
       data: comment,
       success: function(data) {
         this.setState({data: data});
       }.bind(this),
       error: function(xhr, status, err) {
         console.error(this.props.url, status, err.toString());
       }.bind(this)
     });
   });
 },
 getInitialState: function() {
   return {data: []};
 },
 componentDidMount: function() {
   this.loadCommentsFromServer();
   setInterval(this.loadCommentsFromServer, this.props.pollInterval);
 },
 render: function() {
   return (
     <div className="commentBox">
       <h1>Comments</h1>
       <CommentList data={this.state.data} />
       <CommentForm onCommentSubmit={this.handleCommentSubmit} />
     </div>
   );
 }
});


/**
 * CommentList
 * Container for the list of comments
 */
var CommentList = React.createClass({
 render: function() {
   var commentNodes = this.props.data.map(function(comment, index) {
     return (
       // `key` is a React-specific concept and is not mandatory for the
       // purpose of this tutorial. if you're curious, see more here:
       // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
       <Comment author={comment.author} key={index}>
         {comment.text}
       </Comment>
     );
   });
   return (
     <div className="commentList">
       {commentNodes}
     </div>
   );
 }
});


/**
 * CommentForm
 * The form for making a comment
 */
var CommentForm = React.createClass({
 handleSubmit: function() {
   var author = this.refs.author.getDOMNode().value.trim();
   var text = this.refs.text.getDOMNode().value.trim();
   this.props.onCommentSubmit({author: author, text: text});
   this.refs.author.getDOMNode().value = '';
   this.refs.text.getDOMNode().value = '';
   return false;
 },
 render: function() {
   return (
     <form className="commentForm" onSubmit={this.handleSubmit}>
       <input type="text" placeholder="Your name" ref="author" />
       <input type="text" placeholder="Say something..." ref="text" />
       <input type="submit" value="Post" />
     </form>
   );
 }
});






/**
 * Render Components
 */
React.renderComponent(
 <CommentBox url="json/comments.json" pollInterval={2000} />,
 document.getElementById('content')
);





