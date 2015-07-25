Template.Header.events({
  'click .project-preview-btn': function (event, template) {
    debugger
    var projectId = this._id;
    var block = Blocks.findOne({
      projectId: projectId,
      index: 0
    });
    var trial = Trials.findOne({
      projectId: projectId,
      blockId: block._id,
      index: 0
    });
    Router.go('/preview/'+projectId+'/'+block._id+'/'+trial._id);
  }
});