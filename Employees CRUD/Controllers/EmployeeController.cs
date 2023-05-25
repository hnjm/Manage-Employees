using Employees_CRUD.Data;
using Employees_CRUD.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Employees_CRUD.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDbContext _dbContext;

        public EmployeeController(EmployeeDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees(int page = 1, int pageSize = 50)
        {
            var employees = await _dbContext.Employees
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(employees);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _dbContext.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }


        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployeesByEmailOrMobile(string? email, string? mobile)
        {
            var employees = await _dbContext.Employees
                .Where(e => e.Email == email || e.Mobile == mobile)
                .ToListAsync();

            return Ok(employees);
        }




        [HttpPost]
        public async Task<ActionResult<Employee>> CreateEmployee(Employee employee)
        {
            _dbContext.Employees.Add(employee);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.Id }, employee);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, Employee employee)
        {
            if (id != employee.Id)
            {
                return BadRequest();
            }

            _dbContext.Entry(employee).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var employee = await _dbContext.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            _dbContext.Employees.Remove(employee);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("deleteSelected")]
        public async Task<IActionResult> DeleteSelectedEmployees([FromBody]int[] ids)
        {
            var employees = await _dbContext.Employees
                .Where(e => ids.Contains(e.Id))
                .ToListAsync();

            if (employees.Count == 0)
            {
                return NotFound();
            }

            _dbContext.Employees.RemoveRange(employees);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }





        private bool EmployeeExists(int id)
        {
            return _dbContext.Employees.Any(e => e.Id == id);
        }
    }
}
