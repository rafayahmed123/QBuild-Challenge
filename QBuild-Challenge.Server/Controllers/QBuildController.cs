using Microsoft.AspNetCore.Mvc;
using QBuild_Challenge.Server.Model;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json;

namespace QBuild_Challenge.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QBuildController : ControllerBase
    {
        private IConfiguration _configuration;

        public QBuildController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("GetBom")]
        public string GetBom()
        {
            string query = "select * from dbo.bom";
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnectString");

            using (SqlConnection sqlConnection = new SqlConnection(sqlDataSource))
            {
                sqlConnection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(query, sqlConnection))
                {
                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        List<bom> resultList = new List<bom>();

                        while (reader.Read())
                        {
                            // Create an object with data from the reader
                            bom bomItem = new bom
                            {
                                PARENT_NAME = reader.GetString(0),
                                QUANTITY = reader.GetString(1),
                                COMPONENT_NAME = reader.GetString(2)
                            };

                            resultList.Add(bomItem);
                        }

                        // Serialize the list to JSON
                        string jsonData = JsonSerializer.Serialize(resultList);

                        return jsonData;
                    }
                }

            }
        }

        [HttpGet]
        [Route("GetParts")]
        public string GetParts(string componentName)
        {
            // Use parameterized query to prevent SQL injection
            string query = "SELECT * FROM dbo.part WHERE NAME = @ComponentName";
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnectString");

            using (SqlConnection sqlConnection = new SqlConnection(sqlDataSource))
            {
                sqlConnection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(query, sqlConnection))
                {
                    // Add parameter to the SqlCommand
                    sqlCommand.Parameters.AddWithValue("@ComponentName", componentName);

                    using (SqlDataReader reader = sqlCommand.ExecuteReader())
                    {
                        List<part> resultList = new List<part>();

                        while (reader.Read())
                        {
                            part partItem = new part
                            {
                                NAME = reader.GetString(0),
                                TYPE = reader.GetString(1),
                                ITEM = reader.GetString(2),
                                PART_NUMBER = reader.GetString(3),
                                TITLE = reader.GetString(4),
                                MATERIAL = reader.GetString(5)
                            };

                            resultList.Add(partItem);
                        }

                        // Serialize the list to JSON
                        string jsonData = JsonSerializer.Serialize(resultList);

                        return jsonData;
                    }
                }
            }

        }
    }
}


