using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AuraFanVerse.Client
{
    public class TelemetryPacket
    {
        public string PacketId { get; set; } = string.Empty;
        public double SpeedKmh { get; set; }
        public double SpinRpm { get; set; }
        public string Signature { get; set; } = string.Empty;
    }

    public class AuraClient
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;

        public AuraClient(string baseUrl = "http://localhost:8000", HttpClient? httpClient = null)
        {
            _baseUrl = baseUrl.TrimEnd('/');
            _httpClient = httpClient ?? new HttpClient();
        }

        public async Task<string> GetHealthAsync()
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/api/health");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }

        public async Task<bool> VerifyTelemetryAsync(TelemetryPacket packet)
        {
            var json = JsonSerializer.Serialize(packet);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"{_baseUrl}/api/security/verify", content);
            return response.IsSuccessStatusCode;
        }
    }
}
