using System.Threading.Tasks;
using CodingSmithSignalRTutorial.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace CodingSmithSignalRTutorial.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MessageController : Controller
    {
        private readonly IHubContext<MessageHub> _hubContext;

        public MessageController(IHubContext<MessageHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task SendMessageToAll(MessageRequest message)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", message.Message);
        }
    }

    public class MessageRequest
    {
        public string Message { get; set; }
    }
}
