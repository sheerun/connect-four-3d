import React from 'react'
import ChatWindow from 'react-chat-window/lib/components/ChatWindow'
import 'react-chat-window/lib/styles'

class Ui extends React.Component {
  render () {
    return <div>
      <div id="chat" className="chat" style={{width: 370, height: 500}}>
        <ChatWindow isOpen={true} agentProfile={{teamName: '', imageUrl: ''}} onClose={() => {}} showEmoji={true}/>
      </div>
    </div>
  }
}

export default Ui
